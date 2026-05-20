import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  return NextResponse.json({
    client_id: process.env.STRAVA_CLIENT_ID ?? 'NOT SET',
    client_secret_set: !!process.env.STRAVA_CLIENT_SECRET,
    request_origin: origin,
    next_public_app_url: process.env.NEXT_PUBLIC_APP_URL ?? 'NOT SET',
    redirect_uri_would_be: `${origin}/api/strava/callback?origin=%2Fguia%2Fperfil`,
  })
}
