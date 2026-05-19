import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await createAdminClient()
  await admin.from('strava_connections').delete().eq('user_id', user.id)
  await admin.from('guides').update({ strava_stats: null }).eq('id', user.id)
  await admin.from('profiles').update({ strava_stats: null }).eq('id', user.id)

  return NextResponse.json({ ok: true })
}
