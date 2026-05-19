import { redirect } from 'next/navigation'
import { buildStravaAuthUrl } from '@/lib/strava/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const origin = searchParams.get('origin') ?? '/dashboard/perfil'

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const redirectUri = `${appUrl}/api/strava/callback?origin=${encodeURIComponent(origin)}`

  redirect(buildStravaAuthUrl(redirectUri))
}
