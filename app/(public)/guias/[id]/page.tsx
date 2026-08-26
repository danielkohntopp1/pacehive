import { notFound } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import GuideProfile from '@/components/guides/GuideProfile'
import { fetchStravaStats } from '@/lib/strava/client'
import type { Guide, Profile, Review, StravaStats } from '@/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('guides')
    .select('*, profile:profiles(name, avatar_url)')
    .eq('id', id)
    .single()

  if (!data) return { title: 'Guia não encontrado — PaceHive' }

  const title = `${data.profile?.name} — Guia em ${data.city} | PaceHive`
  const description = data.bio ?? `Corra com ${data.profile?.name} em ${data.city}. Encontre guias locais na PaceHive.`
  const image = data.profile?.avatar_url ?? '/images/og-default.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${data.profile?.name} — PaceHive` }],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

async function maybeRefreshStravaStats(guideId: string): Promise<StravaStats | null> {
  try {
    const admin = await createAdminClient()
    const { data: conn } = await admin
      .from('strava_connections')
      .select('access_token, refresh_token, expires_at, strava_athlete_id, updated_at')
      .eq('user_id', guideId)
      .single()

    if (!conn) return null

    const sixHours = 6 * 60 * 60 * 1000
    if (Date.now() - new Date(conn.updated_at).getTime() < sixHours) return null

    const fresh = await fetchStravaStats(conn, async (tokens) => {
      await admin.from('strava_connections').update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(tokens.expires_at * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('user_id', guideId)
    })

    await Promise.all([
      admin.from('guides').update({ strava_stats: fresh, updated_at: new Date().toISOString() }).eq('id', guideId),
      admin.from('strava_connections').update({ updated_at: new Date().toISOString() }).eq('user_id', guideId),
    ])

    return fresh
  } catch {
    return null
  }
}

export default async function GuideProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [guideRes, reviewsRes, userRes] = await Promise.all([
    supabase.from('guides').select('*, profile:profiles(*)').eq('id', id).single(),
    supabase.from('reviews').select('*, reviewer:profiles(*)').eq('reviewed_id', id).order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  if (!guideRes.data) notFound()

  const freshStravaStats = guideRes.data.strava_stats
    ? await maybeRefreshStravaStats(id)
    : null

  const guide = freshStravaStats
    ? { ...guideRes.data, strava_stats: freshStravaStats }
    : guideRes.data

  return (
    <section className="py-12 px-4 bg-[#F9F5EE] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <GuideProfile
          guide={guide as Guide & { profile: Profile }}
          reviews={(reviewsRes.data ?? []) as (Review & { reviewer: Profile })[]}
          isLoggedIn={!!userRes.data.user}
        />
      </div>
    </section>
  )
}
