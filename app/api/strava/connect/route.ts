import { NextResponse } from 'next/server'
import { buildStravaAuthUrl } from '@/lib/strava/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const clientId = process.env.STRAVA_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'STRAVA_CLIENT_ID not configured' }, { status: 500 })
  }

  const { searchParams, origin: requestOrigin } = new URL(request.url)
  const returnTo = searchParams.get('origin') ?? '/guia/perfil'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${requestOrigin}/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'guide' && profile.role !== 'both')) {
    return NextResponse.redirect(`${requestOrigin}${returnTo}?strava=not_allowed`)
  }

  const redirectUri = `${requestOrigin}/api/strava/callback?origin=${encodeURIComponent(returnTo)}`

  return NextResponse.redirect(buildStravaAuthUrl(redirectUri))
}
