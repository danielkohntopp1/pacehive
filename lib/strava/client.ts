export interface StravaTokens {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete: {
    id: number
    firstname: string
    lastname: string
    city: string
    country: string
    profile: string
  }
}

export interface StravaStats {
  ytd_run_distance: number
  ytd_run_count: number
  avg_pace: number | null
  last_activity_at: string | null
}

const BASE = 'https://www.strava.com/api/v3'

// Enquanto o app aguarda aprovação oficial do Strava, apenas um número
// limitado de contas pode se conectar (contas de teste do app não-aprovado).
export const STRAVA_ACCOUNT_LIMIT = 10

export async function exchangeStravaCode(code: string): Promise<StravaTokens> {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  })
  if (!res.ok) throw new Error(`Strava token exchange failed: ${res.status}`)
  return res.json()
}

async function refreshStravaToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string; expires_at: number }> {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error(`Strava token refresh failed: ${res.status}`)
  return res.json()
}

interface Connection {
  access_token: string
  refresh_token: string
  expires_at: string
  strava_athlete_id: number
}

export async function fetchStravaStats(
  connection: Connection,
  onTokenRefresh?: (tokens: { access_token: string; refresh_token: string; expires_at: number }) => Promise<void>
): Promise<StravaStats> {
  let token = connection.access_token
  const expiresAt = new Date(connection.expires_at).getTime() / 1000

  if (Date.now() / 1000 > expiresAt - 300) {
    const fresh = await refreshStravaToken(connection.refresh_token)
    token = fresh.access_token
    if (onTokenRefresh) await onTokenRefresh(fresh)
  }

  const [statsRes, activitiesRes] = await Promise.all([
    fetch(`${BASE}/athletes/${connection.strava_athlete_id}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${BASE}/athlete/activities?per_page=20&before=${Math.floor(Date.now() / 1000)}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ])

  const stats = statsRes.ok ? await statsRes.json() : null
  const activities = activitiesRes.ok ? await activitiesRes.json() : []

  const runs: { distance: number; moving_time: number; start_date: string }[] = (Array.isArray(activities)
    ? activities.filter((a: { type: string }) => a.type === 'Run')
    : []
  ).sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())

  let avgPace: number | null = null
  if (runs.length > 0) {
    const totalSecsPerKm = runs.reduce((sum, a) => {
      const km = a.distance / 1000
      return km > 0 ? sum + a.moving_time / km : sum
    }, 0)
    avgPace = Math.round(totalSecsPerKm / runs.length)
  }

  const lastActivity = runs[0]?.start_date ?? null

  return {
    ytd_run_distance: stats?.ytd_run_totals?.distance ?? 0,
    ytd_run_count: stats?.ytd_run_totals?.count ?? 0,
    avg_pace: avgPace,
    last_activity_at: lastActivity,
  }
}

export function formatPace(secsPerKm: number): string {
  const mins = Math.floor(secsPerKm / 60)
  const secs = secsPerKm % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDistance(meters: number): string {
  const km = meters / 1000
  return km >= 1000
    ? `${(km / 1000).toFixed(1).replace('.', ',')} mil km`
    : `${Math.round(km).toLocaleString('pt-BR')} km`
}

export function formatLastActivity(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days} dias`
  if (days < 30) return `há ${Math.floor(days / 7)} semana${Math.floor(days / 7) > 1 ? 's' : ''}`
  const months = Math.floor(days / 30)
  return `há ${months} ${months === 1 ? 'mês' : 'meses'}`
}

export function buildStravaAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'read,activity:read,profile:read_all',
  })
  return `https://www.strava.com/oauth/authorize?${params}`
}
