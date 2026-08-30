import { Resend } from 'resend'
import { createTranslator } from 'next-intl'
import ptMessages from '@/messages/pt.json'
import enMessages from '@/messages/en.json'
import type { Booking, Profile } from '@/types'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

const FROM = process.env.RESEND_FROM_EMAIL || 'noreply@pacehive.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://pacehive.com'

type EmailLocale = 'pt' | 'en'

function getEmailTranslator(locale: EmailLocale) {
  const messages = locale === 'en' ? enMessages : ptMessages
  return createTranslator({ locale, messages, namespace: 'emails' })
}

type EmailTranslator = ReturnType<typeof getEmailTranslator>

function resolveLocale(profile: Profile): EmailLocale {
  return profile.ui_locale === 'en' ? 'en' : 'pt'
}

function emailWrapper(locale: EmailLocale, t: EmailTranslator, content: string, previewText: string): string {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="${locale === 'en' ? 'en-US' : 'pt-BR'}">
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
    ${t('footerCopyright', { year })}<br/>
    <a href="${APP_URL}" style="color:#F5A623;text-decoration:none;">pacehive.com</a>
  </div>
</div>
</body>
</html>`
}

function bookingDetails(t: EmailTranslator, booking: Booking): string {
  const modalityLabel = booking.modality === 'presential' ? t('bookingDetails.presential') : t('bookingDetails.virtual')
  return `<div class="detail-box">
    <div class="detail-row"><span class="detail-label">${t('bookingDetails.date')}</span><span class="detail-value">${booking.run_date}</span></div>
    <div class="detail-row"><span class="detail-label">${t('bookingDetails.time')}</span><span class="detail-value">${booking.run_time.slice(0, 5)}</span></div>
    <div class="detail-row"><span class="detail-label">${t('bookingDetails.city')}</span><span class="detail-value">${booking.city}</span></div>
    <div class="detail-row"><span class="detail-label">${t('bookingDetails.modality')}</span><span class="detail-value">${modalityLabel}</span></div>
    ${booking.distance_km ? `<div class="detail-row"><span class="detail-label">${t('bookingDetails.distance')}</span><span class="detail-value">${booking.distance_km} km</span></div>` : ''}
    ${booking.pace ? `<div class="detail-row"><span class="detail-label">${t('bookingDetails.pace')}</span><span class="detail-value">${booking.pace} min/km</span></div>` : ''}
    ${booking.notes ? `<div class="detail-row"><span class="detail-label">${t('bookingDetails.notes')}</span><span class="detail-value">${booking.notes}</span></div>` : ''}
  </div>`
}

export async function sendNewBookingToGuide(booking: Booking, runner: Profile, guide: Profile) {
  const locale = resolveLocale(guide)
  const t = getEmailTranslator(locale)
  const content = `
    <h1>${t('newBookingToGuide.heading')}</h1>
    <p>${t('newBookingToGuide.greeting', { guideName: `<strong>${guide.name}</strong>`, runnerName: `<strong>${runner.name}</strong>` })}</p>
    ${bookingDetails(t, booking)}
    <p>${t('newBookingToGuide.respondAsap')}</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guia/pedidos/${booking.id}?action=accept" class="btn btn-primary">${t('newBookingToGuide.acceptButton')}</a>
      <a href="${APP_URL}/guia/pedidos/${booking.id}?action=refuse" class="btn btn-outline">${t('newBookingToGuide.refuseButton')}</a>
    </div>
    <p style="color:#6B6B6B;font-size:13px;">${t('newBookingToGuide.timeLimitNote')}</p>
  `
  return getResend().emails.send({
    from: FROM,
    to: guide.email,
    subject: t('newBookingToGuide.subject'),
    html: emailWrapper(locale, t, content, t('newBookingToGuide.previewText')),
  })
}

export async function sendBookingAcceptedToRunner(booking: Booking, runner: Profile, guide: Profile & { instagram_url?: string; phone?: string }) {
  const locale = resolveLocale(runner)
  const t = getEmailTranslator(locale)
  const content = `
    <h1>${t('bookingAcceptedToRunner.heading')}</h1>
    <p>${t('bookingAcceptedToRunner.greeting', { runnerName: `<strong>${runner.name}</strong>`, guideName: `<strong>${guide.name}</strong>` })}</p>
    ${bookingDetails(t, booking)}
    <div class="detail-box">
      <p style="margin:0 0 12px;font-weight:700;">${t('bookingAcceptedToRunner.guideDetailsTitle')}</p>
      <div class="detail-row"><span class="detail-label">${t('bookingAcceptedToRunner.name')}</span><span class="detail-value">${guide.name}</span></div>
      ${guide.email ? `<div class="detail-row"><span class="detail-label">${t('bookingAcceptedToRunner.email')}</span><span class="detail-value">${guide.email}</span></div>` : ''}
      ${guide.phone ? `<div class="detail-row"><span class="detail-label">${t('bookingAcceptedToRunner.whatsapp')}</span><span class="detail-value">${guide.phone}</span></div>` : ''}
      ${guide.instagram_url ? `<div class="detail-row"><span class="detail-label">${t('bookingAcceptedToRunner.instagram')}</span><span class="detail-value"><a href="${guide.instagram_url}" style="color:#F5A623;">${guide.instagram_url}</a></span></div>` : ''}
    </div>
    <p>${t('bookingAcceptedToRunner.contactMessage')}</p>
  `
  return getResend().emails.send({
    from: FROM,
    to: runner.email,
    subject: t('bookingAcceptedToRunner.subject'),
    html: emailWrapper(locale, t, content, t('bookingAcceptedToRunner.previewText')),
  })
}

export async function sendBookingAcceptedToGuide(booking: Booking, runner: Profile, guide: Profile) {
  const locale = resolveLocale(guide)
  const t = getEmailTranslator(locale)
  const content = `
    <h1>${t('bookingAcceptedToGuide.heading')}</h1>
    <p>${t('bookingAcceptedToGuide.greeting', { guideName: `<strong>${guide.name}</strong>`, runnerName: `<strong>${runner.name}</strong>` })}</p>
    ${bookingDetails(t, booking)}
    <div class="detail-box">
      <p style="margin:0 0 12px;font-weight:700;">${t('bookingAcceptedToGuide.runnerDetailsTitle')}</p>
      <div class="detail-row"><span class="detail-label">${t('bookingAcceptedToGuide.name')}</span><span class="detail-value">${runner.name}</span></div>
      <div class="detail-row"><span class="detail-label">${t('bookingAcceptedToGuide.email')}</span><span class="detail-value">${runner.email}</span></div>
      ${runner.phone ? `<div class="detail-row"><span class="detail-label">${t('bookingAcceptedToGuide.whatsapp')}</span><span class="detail-value">${runner.phone}</span></div>` : ''}
    </div>
    <p>${t('bookingAcceptedToGuide.contactMessage')}</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${APP_URL}/guia/dashboard" class="btn btn-primary">${t('bookingAcceptedToGuide.viewDashboardButton')}</a>
    </div>
  `
  return getResend().emails.send({
    from: FROM,
    to: guide.email,
    subject: t('bookingAcceptedToGuide.subject'),
    html: emailWrapper(locale, t, content, t('bookingAcceptedToGuide.previewText')),
  })
}

export async function sendBookingRefusedToRunner(booking: Booking, runner: Profile, guide: Profile) {
  const locale = resolveLocale(runner)
  const t = getEmailTranslator(locale)
  const content = `
    <h1>${t('bookingRefusedToRunner.heading')}</h1>
    <p>${t('bookingRefusedToRunner.greeting', { runnerName: `<strong>${runner.name}</strong>`, guideName: `<strong>${guide.name}</strong>` })}</p>
    ${bookingDetails(t, booking)}
    <p>${t('bookingRefusedToRunner.dontGiveUp')}</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guias" class="btn btn-primary">${t('bookingRefusedToRunner.viewOtherGuidesButton')}</a>
    </div>
  `
  return getResend().emails.send({
    from: FROM,
    to: runner.email,
    subject: t('bookingRefusedToRunner.subject'),
    html: emailWrapper(locale, t, content, t('bookingRefusedToRunner.previewText')),
  })
}

export async function sendReminderToGuide(booking: Booking, runner: Profile, guide: Profile) {
  const locale = resolveLocale(guide)
  const t = getEmailTranslator(locale)
  const content = `
    <h1>${t('reminderToGuide.heading')}</h1>
    <p>${t('reminderToGuide.greeting', { guideName: `<strong>${guide.name}</strong>`, runnerName: `<strong>${runner.name}</strong>` })}</p>
    ${bookingDetails(t, booking)}
    <p>${t('reminderToGuide.respondAsap')}</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guia/pedidos/${booking.id}?action=accept" class="btn btn-primary">${t('reminderToGuide.acceptButton')}</a>
      <a href="${APP_URL}/guia/pedidos/${booking.id}?action=refuse" class="btn btn-outline">${t('reminderToGuide.refuseButton')}</a>
    </div>
    <p style="color:#6B6B6B;font-size:13px;">${t('reminderToGuide.noResponseNote')}</p>
  `
  return getResend().emails.send({
    from: FROM,
    to: guide.email,
    subject: t('reminderToGuide.subject'),
    html: emailWrapper(locale, t, content, t('reminderToGuide.previewText')),
  })
}

export async function sendReviewRequestToBoth(booking: Booking, runner: Profile, guide: Profile) {
  const runnerLocale = resolveLocale(runner)
  const guideLocale = resolveLocale(guide)
  const tRunner = getEmailTranslator(runnerLocale)
  const tGuide = getEmailTranslator(guideLocale)

  const runnerContent = `
    <h1>${tRunner('reviewRequest.heading')}</h1>
    <p>${tRunner('reviewRequest.greetingRunner', { runnerName: `<strong>${runner.name}</strong>`, guideName: `<strong>${guide.name}</strong>` })}</p>
    <p>${tRunner('reviewRequest.bodyRunner')}</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/dashboard/pedidos/${booking.id}?action=review" class="btn btn-primary">${tRunner('reviewRequest.buttonRunner')}</a>
    </div>
  `
  const guideContent = `
    <h1>${tGuide('reviewRequest.heading')}</h1>
    <p>${tGuide('reviewRequest.greetingGuide', { guideName: `<strong>${guide.name}</strong>`, runnerName: `<strong>${runner.name}</strong>` })}</p>
    <p>${tGuide('reviewRequest.bodyGuide')}</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guia/pedidos/${booking.id}?action=review" class="btn btn-primary">${tGuide('reviewRequest.buttonGuide')}</a>
    </div>
  `
  await Promise.all([
    getResend().emails.send({
      from: FROM,
      to: runner.email,
      subject: tRunner('reviewRequest.subject'),
      html: emailWrapper(runnerLocale, tRunner, runnerContent, tRunner('reviewRequest.previewTextRunner')),
    }),
    getResend().emails.send({
      from: FROM,
      to: guide.email,
      subject: tGuide('reviewRequest.subject'),
      html: emailWrapper(guideLocale, tGuide, guideContent, tGuide('reviewRequest.previewTextGuide')),
    }),
  ])
}

export async function sendBookingCancelledToGuide(booking: Booking, runner: Profile, guide: Profile) {
  const locale = resolveLocale(guide)
  const t = getEmailTranslator(locale)
  const content = `
    <h1>${t('bookingCancelledToGuide.heading')}</h1>
    <p>${t('bookingCancelledToGuide.greeting', { guideName: `<strong>${guide.name}</strong>`, runnerName: `<strong>${runner.name}</strong>` })}</p>
    ${bookingDetails(t, booking)}
    <p style="color:#6B6B6B;font-size:13px;">${t('bookingCancelledToGuide.supportNote')}</p>
  `
  return getResend().emails.send({
    from: FROM,
    to: guide.email,
    subject: t('bookingCancelledToGuide.subject'),
    html: emailWrapper(locale, t, content, t('bookingCancelledToGuide.previewText')),
  })
}

export async function sendBookingCancelledToRunner(booking: Booking, runner: Profile, guide: Profile) {
  const locale = resolveLocale(runner)
  const t = getEmailTranslator(locale)
  const content = `
    <h1>${t('bookingCancelledToRunner.heading')}</h1>
    <p>${t('bookingCancelledToRunner.greeting', { runnerName: `<strong>${runner.name}</strong>`, guideName: `<strong>${guide.name}</strong>` })}</p>
    ${bookingDetails(t, booking)}
    <p>${t('bookingCancelledToRunner.dontGiveUp')}</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guias" class="btn btn-primary">${t('bookingCancelledToRunner.viewOtherGuidesButton')}</a>
    </div>
  `
  return getResend().emails.send({
    from: FROM,
    to: runner.email,
    subject: t('bookingCancelledToRunner.subject'),
    html: emailWrapper(locale, t, content, t('bookingCancelledToRunner.previewText')),
  })
}

export async function sendWelcomeToGuide(profile: Profile) {
  const locale = resolveLocale(profile)
  const t = getEmailTranslator(locale)
  const content = `
    <h1>${t('welcomeToGuide.heading')}</h1>
    <p>${t('welcomeToGuide.greeting', { name: `<strong>${profile.name}</strong>` })}</p>
    <p>${t('welcomeToGuide.introText')}</p>
    <div class="detail-box">
      <div class="detail-row"><span class="detail-label">1.</span><span class="detail-value">${t('welcomeToGuide.step1')}</span></div>
      <div class="detail-row"><span class="detail-label">2.</span><span class="detail-value">${t('welcomeToGuide.step2')}</span></div>
      <div class="detail-row"><span class="detail-label">3.</span><span class="detail-value">${t('welcomeToGuide.step3')}</span></div>
      <div class="detail-row"><span class="detail-label">4.</span><span class="detail-value">${t('welcomeToGuide.step4')}</span></div>
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a href="${APP_URL}/guia/perfil" class="btn btn-primary">${t('welcomeToGuide.completeProfileButton')}</a>
    </div>
    <p style="color:#6B6B6B;font-size:13px;">${t('welcomeToGuide.helpNote')}</p>
  `
  return getResend().emails.send({
    from: FROM,
    to: profile.email,
    subject: t('welcomeToGuide.subject'),
    html: emailWrapper(locale, t, content, t('welcomeToGuide.previewText')),
  })
}
