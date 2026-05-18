import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBookingRefusedToRunner } from '@/lib/resend/emails'
import { notifyBookingRefused } from '@/lib/supabase/notifications'
import type { Profile } from '@/types'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ status: 'refused', updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('guide_id', user.id)
      .eq('status', 'pending')
      .select()
      .single()

    if (error || !booking) return NextResponse.json({ error: 'Pedido não encontrado ou já respondido' }, { status: 404 })

    try {
      const [runnerRes, guideRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', booking.runner_id).single(),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
      ])
      if (runnerRes.data && guideRes.data) {
        await Promise.all([
          sendBookingRefusedToRunner(booking, runnerRes.data as Profile, guideRes.data as Profile),
          notifyBookingRefused(booking.id, booking.runner_id, guideRes.data.name, booking.run_date),
        ])
      }
    } catch (e) {
      console.error('Email error:', e)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
