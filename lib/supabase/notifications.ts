import { createAdminClient } from '@/lib/supabase/server'

function fmtDate(dateStr: string) {
  const [, m, d] = dateStr.split('-')
  return `${d}/${m}`
}

// Cada notificação grava `title`/`body` já prontos em português (fallback
// para linhas antigas e para quem olha o banco direto) e também `type` +
// `data` com os parâmetros brutos, para a UI poder montar o texto no idioma
// de quem está lendo a notificação — que pode não ser quem gerou o evento.

export async function notifyNewBooking(bookingId: string, guideId: string, runnerName: string, runDate: string) {
  const admin = await createAdminClient()
  await admin.from('notifications').insert({
    user_id: guideId,
    type: 'new_booking',
    title: 'Nova solicitação de corrida',
    body: `${runnerName} quer correr em ${fmtDate(runDate)}`,
    data: { name: runnerName, date: runDate },
    booking_id: bookingId,
  })
}

export async function notifyBookingAccepted(bookingId: string, runnerId: string, guideName: string, runDate: string) {
  const admin = await createAdminClient()
  await admin.from('notifications').insert({
    user_id: runnerId,
    type: 'booking_accepted',
    title: 'Corrida confirmada!',
    body: `${guideName} aceitou seu pedido para ${fmtDate(runDate)}`,
    data: { name: guideName, date: runDate },
    booking_id: bookingId,
  })
}

export async function notifyBookingRefused(bookingId: string, runnerId: string, guideName: string, runDate: string) {
  const admin = await createAdminClient()
  await admin.from('notifications').insert({
    user_id: runnerId,
    type: 'booking_refused',
    title: 'Pedido recusado',
    body: `${guideName} não está disponível para ${fmtDate(runDate)}`,
    data: { name: guideName, date: runDate },
    booking_id: bookingId,
  })
}

export async function notifyBookingCancelled(bookingId: string, recipientId: string, cancellerName: string, runDate: string) {
  const admin = await createAdminClient()
  await admin.from('notifications').insert({
    user_id: recipientId,
    type: 'booking_cancelled',
    title: 'Corrida cancelada',
    body: `${cancellerName} cancelou a corrida de ${fmtDate(runDate)}`,
    data: { name: cancellerName, date: runDate },
    booking_id: bookingId,
  })
}

export async function notifyBookingCompleted(bookingId: string, runnerId: string, guideId: string, runnerName: string, guideName: string) {
  const admin = await createAdminClient()
  await admin.from('notifications').insert([
    {
      user_id: runnerId,
      type: 'booking_completed',
      title: 'Corrida concluída',
      body: `Avalie sua experiência com ${guideName}`,
      data: { name: guideName },
      booking_id: bookingId,
    },
    {
      user_id: guideId,
      type: 'booking_completed',
      title: 'Corrida concluída',
      body: `Avalie sua experiência com ${runnerName}`,
      data: { name: runnerName },
      booking_id: bookingId,
    },
  ])
}

export async function notifyNewReview(reviewedId: string, bookingId: string, reviewerName: string, rating: number) {
  const admin = await createAdminClient()
  await admin.from('notifications').insert({
    user_id: reviewedId,
    type: 'new_review',
    title: 'Nova avaliação recebida',
    body: `${reviewerName} te deu ${rating} estrela${rating !== 1 ? 's' : ''}`,
    data: { name: reviewerName, rating },
    booking_id: bookingId,
  })
}
