import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { notifyNewReview } from '@/lib/supabase/notifications'
import { localeCookieName, defaultLocale, type Locale } from '@/i18n/config'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get(localeCookieName)?.value as Locale) || defaultLocale
  const t = await getTranslations({ locale, namespace: 'reviewsApi' })

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: t('notAuthenticated') }, { status: 401 })

    const { booking_id, reviewed_id, rating, comment } = await req.json()

    if (!booking_id || !reviewed_id || !rating) {
      return NextResponse.json({ error: t('missingRequiredFields') }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: t('ratingRange') }, { status: 400 })
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        booking_id,
        reviewer_id: user.id,
        reviewed_id,
        rating,
        comment: comment ?? null,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: t('alreadyReviewed') }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update guide rating average
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('reviewed_id', reviewed_id)

    if (allReviews && allReviews.length > 0) {
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      await supabase
        .from('guides')
        .update({ rating_avg: Math.round(avg * 100) / 100, rating_count: allReviews.length })
        .eq('id', reviewed_id)
    }

    // Notify reviewed person
    try {
      const { data: reviewer } = await supabase.from('profiles').select('name').eq('id', user.id).single()
      if (reviewer) {
        await notifyNewReview(reviewed_id, booking_id, reviewer.name, rating)
      }
    } catch (e) {
      console.error('Notification error:', e)
    }

    return NextResponse.json(review, { status: 201 })
  } catch {
    return NextResponse.json({ error: t('internalError') }, { status: 500 })
  }
}
