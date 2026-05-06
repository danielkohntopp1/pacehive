import { Resend } from 'resend'
import type { Booking, Profile } from '@/types'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

const FROM = process.env.RESEND_FROM_EMAIL || 'noreply@pacehive.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://pacehive.com'

function emailWrapper(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${previewText}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  body{margin:0;padding:0;background:#f4f4f4;font-family:'Plus Jakarta Sans',Arial,sans-serif;}
  .wrapper{max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;}
  .header{background:#F5A623;padding:32px 40px;text-align:center;}
  .header img{height:40px;}
  .body{padding:40px;}
  .footer{background:#0A0A0A;padding:24px 40px;text-align:center;color:#6B6B6B;font-size:13px;}
  h1{font-size:24px;font-weight:800;color:#0A0A0A;margin:0 0 16px;}
  p{font-size:15px;color:#1A1A1A;line-height:1.6;margin:0 0 16px;}
  .detail-box{background:#F9F5EE;border-radius:12px;padding:20px;margin:20px 0;}
  .detail-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E5E5E5;font-size:14px;}
  .detail-row:last-child{border-bottom:none;}
  .detail-label{color:#6B6B6B;font-weight:600;}
  .detail-value{color:#1A1A1A;font-weight:500;text-align:right;}
  .btn{display:inline-block;padding:14px 32px;border-radius:999px;font-weight:700;font-size:15px;text-decoration:none;margin:8px 4px;}
  .btn-primary{background:#F5A623;color:#0A0A0A;}
  .btn-outline{background:transparent;color:#0A0A0A;border:2px solid #0A0A0A;}
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <img src="${APP_URL}/images/logo/pacehive-horizontal-white.svg" alt="PaceHive" />
  </div>
  <div class="body">${content}</div>
  <div class="footer">
    Copyright &copy; 2026 PaceHive. All rights reserved.<br/>
    <a href="${APP_URL}" style="color:#F5A623;text-decoration:none;">pacehive.com</a>
  </div>
</div>
</body>
</html>`
}

function bookingDetails(booking: Booking): string {
  const modalityLabel = booking.modality === 'presential' ? 'Presencial' : 'Virtual'
  return `<div class="detail-box">
    <div class="detail-row"><span class="detail-label">Data</span><span class="detail-value">${booking.run_date}</span></div>
    <div class="detail-row"><span class="detail-label">Horario</span><span class="detail-value">${booking.run_time.slice(0, 5)}</span></div>
    <div class="detail-row"><span class="detail-label">Cidade</span><span class="detail-value">${booking.city}</span></div>
    <div class="detail-row"><span class="detail-label">Modalidade</span><span class="detail-value">${modalityLabel}</span></div>
    ${booking.distance_km ? `<div class="detail-row"><span class="detail-label">Distancia</span><span class="detail-value">${booking.distance_km} km</span></div>` : ''}
    ${booking.pace ? `<div class="detail-row"><span class="detail-label">Ritmo</span><span class="detail-value">${booking.pace} min/km</span></div>` : ''}
    ${booking.notes ? `<div class="detail-row"><span class="detail-label">Observacoes</span><span class="detail-value">${booking.notes}</span></div>` : ''}
  </div>`
}

export async function sendNewBookingToGuide(booking: Booking, runner: Profile, guide: Profile) {
  const content = `
    <h1>Voce recebeu um novo pedido de corrida!</h1>
    <p>Ola, <strong>${guide.name}</strong>! O corredor <strong>${runner.name}</strong> quer correr com voce.</p>
    ${bookingDetails(booking)}
    <p>Responda o quanto antes para garantir a experiencia do corredor:</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guia/pedidos/${booking.id}?action=accept" class="btn btn-primary">Aceitar pedido</a>
      <a href="${APP_URL}/guia/pedidos/${booking.id}?action=refuse" class="btn btn-outline">Recusar pedido</a>
    </div>
    <p style="color:#6B6B6B;font-size:13px;">Voce tem 24 horas para responder antes que um lembrete seja enviado.</p>
  `
  return getResend().emails.send({
    from: FROM,
    to: guide.email,
    subject: 'Voce recebeu um novo pedido de corrida!',
    html: emailWrapper(content, 'Novo pedido de corrida'),
  })
}

export async function sendBookingAcceptedToRunner(booking: Booking, runner: Profile, guide: Profile & { instagram_url?: string; phone?: string }) {
  const content = `
    <h1>Sua corrida foi confirmada!</h1>
    <p>Ola, <strong>${runner.name}</strong>! Boa noticia - <strong>${guide.name}</strong> aceitou o seu pedido.</p>
    ${bookingDetails(booking)}
    <div class="detail-box">
      <p style="margin:0 0 12px;font-weight:700;">Dados do seu guia:</p>
      <div class="detail-row"><span class="detail-label">Nome</span><span class="detail-value">${guide.name}</span></div>
      ${guide.email ? `<div class="detail-row"><span class="detail-label">E-mail</span><span class="detail-value">${guide.email}</span></div>` : ''}
      ${guide.phone ? `<div class="detail-row"><span class="detail-label">WhatsApp</span><span class="detail-value">${guide.phone}</span></div>` : ''}
      ${guide.instagram_url ? `<div class="detail-row"><span class="detail-label">Instagram</span><span class="detail-value"><a href="${guide.instagram_url}" style="color:#F5A623;">${guide.instagram_url}</a></span></div>` : ''}
    </div>
    <p>Entre em contato para acertar os detalhes finais. Boa corrida!</p>
  `
  return getResend().emails.send({
    from: FROM,
    to: runner.email,
    subject: 'Sua corrida foi confirmada!',
    html: emailWrapper(content, 'Corrida confirmada'),
  })
}

export async function sendBookingAcceptedToGuide(booking: Booking, runner: Profile, guide: Profile) {
  const content = `
    <h1>Voce confirmou uma corrida!</h1>
    <p>Ola, <strong>${guide.name}</strong>! Voce aceitou o pedido de <strong>${runner.name}</strong>.</p>
    ${bookingDetails(booking)}
    <div class="detail-box">
      <p style="margin:0 0 12px;font-weight:700;">Dados do corredor:</p>
      <div class="detail-row"><span class="detail-label">Nome</span><span class="detail-value">${runner.name}</span></div>
      <div class="detail-row"><span class="detail-label">E-mail</span><span class="detail-value">${runner.email}</span></div>
      ${runner.phone ? `<div class="detail-row"><span class="detail-label">WhatsApp</span><span class="detail-value">${runner.phone}</span></div>` : ''}
    </div>
    <p>Entre em contato para acertar os detalhes. Boa corrida!</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${APP_URL}/guia/dashboard" class="btn btn-primary">Ver meu painel</a>
    </div>
  `
  return getResend().emails.send({
    from: FROM,
    to: guide.email,
    subject: 'Voce confirmou uma corrida!',
    html: emailWrapper(content, 'Corrida confirmada'),
  })
}

export async function sendBookingRefusedToRunner(booking: Booking, runner: Profile, guide: Profile) {
  const content = `
    <h1>O guia nao esta disponivel nessa data</h1>
    <p>Ola, <strong>${runner.name}</strong>! Infelizmente <strong>${guide.name}</strong> nao esta disponivel para a corrida abaixo.</p>
    ${bookingDetails(booking)}
    <p>Nao desanime - ha muitos outros guias incriveis disponiveis para voce!</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guias" class="btn btn-primary">Ver outros guias</a>
    </div>
  `
  return getResend().emails.send({
    from: FROM,
    to: runner.email,
    subject: 'O guia nao esta disponivel nessa data',
    html: emailWrapper(content, 'Pedido recusado'),
  })
}

export async function sendReminderToGuide(booking: Booking, runner: Profile, guide: Profile) {
  const content = `
    <h1>Voce tem um pedido aguardando sua resposta</h1>
    <p>Ola, <strong>${guide.name}</strong>! Lembrete: <strong>${runner.name}</strong> ainda aguarda sua resposta.</p>
    ${bookingDetails(booking)}
    <p>Por favor, responda o quanto antes:</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guia/pedidos/${booking.id}?action=accept" class="btn btn-primary">Aceitar pedido</a>
      <a href="${APP_URL}/guia/pedidos/${booking.id}?action=refuse" class="btn btn-outline">Recusar pedido</a>
    </div>
    <p style="color:#6B6B6B;font-size:13px;">Se nao houver resposta em 48h, o corredor sera notificado.</p>
  `
  return getResend().emails.send({
    from: FROM,
    to: guide.email,
    subject: 'Voce tem um pedido aguardando sua resposta',
    html: emailWrapper(content, 'Lembrete: pedido aguardando resposta'),
  })
}

export async function sendReviewRequestToBoth(booking: Booking, runner: Profile, guide: Profile) {
  const runnerContent = `
    <h1>Como foi a corrida? Deixe sua avaliacao!</h1>
    <p>Ola, <strong>${runner.name}</strong>! Esperamos que sua corrida com <strong>${guide.name}</strong> tenha sido incrivel.</p>
    <p>Sua avaliacao ajuda outros corredores a encontrar os melhores guias. Leva menos de 1 minuto!</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/dashboard/pedidos/${booking.id}?action=review" class="btn btn-primary">Avaliar minha corrida</a>
    </div>
  `
  const guideContent = `
    <h1>Como foi a corrida? Deixe sua avaliacao!</h1>
    <p>Ola, <strong>${guide.name}</strong>! Esperamos que sua corrida com <strong>${runner.name}</strong> tenha sido otima.</p>
    <p>Avalie o corredor para ajudar a comunidade PaceHive a crescer!</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guia/pedidos/${booking.id}?action=review" class="btn btn-primary">Avaliar o corredor</a>
    </div>
  `
  await Promise.all([
    getResend().emails.send({
      from: FROM,
      to: runner.email,
      subject: 'Como foi a corrida? Deixe sua avaliacao!',
      html: emailWrapper(runnerContent, 'Avalie sua corrida'),
    }),
    getResend().emails.send({
      from: FROM,
      to: guide.email,
      subject: 'Como foi a corrida? Deixe sua avaliacao!',
      html: emailWrapper(guideContent, 'Avalie o corredor'),
    }),
  ])
}

export async function sendWelcomeToGuide(profile: Profile) {
  const content = `
    <h1>Bem-vindo a comunidade PaceHive!</h1>
    <p>Ola, <strong>${profile.name}</strong>! E muito bom ter voce como guia PaceHive.</p>
    <p>Agora corredores de todo o mundo podem te encontrar e correr com voce. Aqui estao os proximos passos:</p>
    <div class="detail-box">
      <div class="detail-row"><span class="detail-label">1.</span><span class="detail-value">Complete seu perfil publico</span></div>
      <div class="detail-row"><span class="detail-label">2.</span><span class="detail-value">Configure sua disponibilidade</span></div>
      <div class="detail-row"><span class="detail-label">3.</span><span class="detail-value">Adicione sua bio e fotos</span></div>
      <div class="detail-row"><span class="detail-label">4.</span><span class="detail-value">Conecte seu Strava ou Instagram</span></div>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guia/perfil" class="btn btn-primary">Completar meu perfil</a>
    </div>
    <p style="color:#6B6B6B;font-size:13px;">Qualquer duvida, fale com a gente em contato@pacehive.com</p>
  `
  return getResend().emails.send({
    from: FROM,
    to: profile.email,
    subject: 'Bem-vindo a comunidade PaceHive!',
    html: emailWrapper(content, 'Bem-vindo ao PaceHive'),
  })
}
