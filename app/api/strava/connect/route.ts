import { NextResponse } from 'next/server'
import { buildStravaAuthUrl } from '@/lib/strava/client'

export async function GET(request: Request) {
  const clientId = process.env.STRAVA_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'STRAVA_CLIENT_ID not configured' }, { status: 500 })
  }

  const { searchParams, origin: requestOrigin } = new URL(request.url)
  const returnTo = searchParams.get('origin') ?? '/dashboard/perfil'

  const redirectUri = `${requestOrigin}/api/strava/callback?origin=${encodeURIComponent(returnTo)}`

  return NextResponse.redirect(buildStravaAuthUrl(redirectUri))
}
