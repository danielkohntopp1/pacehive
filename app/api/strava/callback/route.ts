import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { exchangeStravaCode, fetchStravaStats } from '@/lib/strava/client'

export async function GET(request: Request) {
  const { searchParams, origin: requestOrigin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const returnTo = searchParams.get('origin') ?? '/dashboard/perfil'

  if (error || !code) {
    return NextResponse.redirect(`${requestOrigin}${returnTo}?strava=denied`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${requestOrigin}/login`)
  }

  try {
    const tokens = await exchangeStravaCode(code)

    const admin = await createAdminClient()
    const expiresAt = new Date(tokens.expires_at * 1000).toISOString()

    await admin.from('strava_connections').upsert({
      user_id: user.id,
      strava_athlete_id: tokens.athlete.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      scope: 'read,activity:read,profile:read_all',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    const connection = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      strava_athlete_id: tokens.athlete.id,
    }

    const stravaStats = await fetchStravaStats(connection, async (fresh) => {
      await admin.from('strava_connections').update({
        access_token: fresh.access_token,
        refresh_token: fresh.refresh_token,
        expires_at: new Date(fresh.expires_at * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id)
    })

    await Promise.all([
      admin.from('guides').update({ strava_stats: stravaStats, updated_at: new Date().toISOString() }).eq('id', user.id),
      admin.from('profiles').update({ strava_stats: stravaStats, updated_at: new Date().toISOString() }).eq('id', user.id),
    ])
  } catch (err) {
    console.error('Strava callback error:', err)
    return NextResponse.redirect(`${requestOrigin}${returnTo}?strava=error`)
  }

  return NextResponse.redirect(`${requestOrigin}${returnTo}?strava=connected`)
}
