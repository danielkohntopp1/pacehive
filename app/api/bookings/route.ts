import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { sendNewBookingToGuide } from '@/lib/resend/emails'
import { notifyNewBooking } from '@/lib/supabase/notifications'
import { localeCookieName, defaultLocale, type Locale } from '@/i18n/config'
import type { Profile } from '@/types'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get(localeCookieName)?.value as Locale) || defaultLocale
  const t = await getTranslations({ locale, namespace: 'bookingsApi' })

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: t('notAuthenticated') }, { status: 401 })

    const body = await req.json()
    const { guide_id, city, run_date, run_time, modality, distance_km, pace, language, notes } = body

    if (!guide_id || !city || !run_date || !run_time || !modality) {
      return NextResponse.json({ error: t('missingRequiredFields') }, { status: 400 })
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
    return NextResponse.json({ error: t('internalError') }, { status: 500 })
  }
}
