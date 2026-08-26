import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { STRAVA_ACCOUNT_LIMIT } from '@/lib/strava/client'

export async function GET() {
  const admin = await createAdminClient()
  const { count } = await admin
    .from('strava_connections')
    .select('*', { count: 'exact', head: true })

  const connectedCount = count ?? 0

  return NextResponse.json({
    connectedCount,
    limit: STRAVA_ACCOUNT_LIMIT,
    limitReached: connectedCount >= STRAVA_ACCOUNT_LIMIT,
  })
}
