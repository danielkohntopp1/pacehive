import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBookingCancelledToGuide, sendBookingCancelledToRunner } from '@/lib/resend/emails'
import { notifyBookingCancelled } from '@/lib/supabase/notifications'
import type { Profile } from '@/types'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (!booking) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })

    const isRunner = booking.runner_id === user.id
    const isGuide = booking.guide_id === user.id
    if (!isRunner && !isGuide) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

    // Runner cancels pending or accepted; guide can only cancel accepted
    const allowedStatuses = isRunner ? ['pending', 'accepted'] : ['accepted']
    if (!allowedStatuses.includes(booking.status)) {
      return NextResponse.json({ error: 'Não é possível cancelar neste estado' }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) return NextResponse.json({ error: 'Erro ao cancelar' }, { status: 500 })

    try {
      const [runnerRes, guideRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', booking.runner_id).single(),
        supabase.from('profiles').select('*').eq('id', booking.guide_id).single(),
      ])
      if (runnerRes.data && guideRes.data) {
        if (isRunner) {
          await Promise.all([
            sendBookingCancelledToGuide(booking, runnerRes.data as Profile, guideRes.data as Profile),
            notifyBookingCancelled(booking.id, booking.guide_id, runnerRes.data.name, booking.run_date),
          ])
        } else {
          await Promise.all([
            sendBookingCancelledToRunner(booking, runnerRes.data as Profile, guideRes.data as Profile),
            notifyBookingCancelled(booking.id, booking.runner_id, guideRes.data.name, booking.run_date),
          ])
        }
      }
    } catch (e) {
      console.error('Email error:', e)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
