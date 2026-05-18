import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendNewBookingToGuide } from '@/lib/resend/emails'
import { notifyNewBooking } from '@/lib/supabase/notifications'
import type { Profile } from '@/types'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const body = await req.json()
    const { guide_id, city, run_date, run_time, modality, distance_km, pace, language, notes } = body

    if (!guide_id || !city || !run_date || !run_time || !modality) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        runner_id: user.id,
        guide_id,
        city,
        run_date,
        run_time,
        modality,
        distance_km: distance_km ?? null,
        pace: pace ?? null,
        language: language ?? 'pt',
        notes: notes ?? null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Send email notification to guide (fire and forget)
    try {
      const [runnerRes, guideRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('profiles').select('*').eq('id', guide_id).single(),
      ])
      if (runnerRes.data && guideRes.data) {
        await Promise.all([
          sendNewBookingToGuide(booking, runnerRes.data as Profile, guideRes.data as Profile),
          notifyNewBooking(booking.id, guide_id, runnerRes.data.name, booking.run_date),
        ])
      }
    } catch (emailError) {
      console.error('Email send failed:', emailError)
    }

    return NextResponse.json(booking, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
