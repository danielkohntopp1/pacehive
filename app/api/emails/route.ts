import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  sendNewBookingToGuide,
  sendBookingAcceptedToRunner,
  sendBookingAcceptedToGuide,
  sendBookingRefusedToRunner,
  sendReminderToGuide,
  sendReviewRequestToBoth,
  sendWelcomeToGuide,
} from '@/lib/resend/emails'
import type { Profile, Booking } from '@/types'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { type, booking_id, profile_id } = await req.json()

    if (type === 'welcome' && profile_id) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', profile_id).single()
      if (profile) await sendWelcomeToGuide(profile as Profile)
      return NextResponse.json({ success: true })
    }

    if (!booking_id) return NextResponse.json({ error: 'booking_id obrigatório' }, { status: 400 })

    const { data: booking } = await supabase.from('bookings').select('*').eq('id', booking_id).single()
    if (!booking) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })

    const [runnerRes, guideRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', booking.runner_id).single(),
      supabase.from('profiles').select('*').eq('id', booking.guide_id).single(),
    ])

    if (!runnerRes.data || !guideRes.data) {
      return NextResponse.json({ error: 'Perfis não encontrados' }, { status: 404 })
    }

    const runner = runnerRes.data as Profile
    const guide = guideRes.data as Profile
    const b = booking as Booking

    switch (type) {
      case 'new_booking': await sendNewBookingToGuide(b, runner, guide); break
      case 'accepted_runner': await sendBookingAcceptedToRunner(b, runner, guide); break
      case 'accepted_guide': await sendBookingAcceptedToGuide(b, runner, guide); break
      case 'refused': await sendBookingRefusedToRunner(b, runner, guide); break
      case 'reminder': await sendReminderToGuide(b, runner, guide); break
      case 'review': await sendReviewRequestToBoth(b, runner, guide); break
      default: return NextResponse.json({ error: 'Tipo de email inválido' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
