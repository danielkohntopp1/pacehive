export type UserRole = 'runner' | 'guide' | 'both'
export type BookingStatus = 'pending' | 'accepted' | 'refused' | 'completed' | 'cancelled'
export type Modality = 'presential' | 'virtual'

export interface GuideAvailability {
  days: string[]    // 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  periods: string[] // 'morning' | 'afternoon' | 'evening'
  notes?: string
}

export interface StravaStats {
  ytd_run_distance: number
  ytd_run_count: number
  avg_pace: number | null
  last_activity_at: string | null
}

export interface Profile {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar_url?: string
  language: string
  ui_locale?: 'pt' | 'en'
  is_banned: boolean
  strava_stats?: StravaStats | null
  created_at: string
  updated_at: string
}

export interface Guide {
  id: string
  city: string
  country: string
  bio?: string
  modality: Modality[]
  run_types: string[]
  services: string[]
  experience_years?: string
  strava_url?: string
  instagram_url?: string
  is_paid: boolean
  price_brl?: number
  schedule?: string
  availability?: GuideAvailability | null
  languages: string[]
  is_active: boolean
  rating_avg: number
  rating_count: number
  total_runs: number
  strava_stats?: StravaStats | null
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Booking {
  id: string
  runner_id: string
  guide_id: string
  city: string
  run_date: string
  run_time: string
  modality: Modality
  distance_km?: number
  pace?: string
  language: string
  notes?: string
  status: BookingStatus
  reminder_sent: boolean
  created_at: string
  updated_at: string
  runner?: Profile
  guide?: Guide & { profile?: Profile }
}

export interface Review {
  id: string
  booking_id: string
  reviewer_id: string
  reviewed_id: string
  rating: number
  comment?: string
  created_at: string
  reviewer?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body?: string
  booking_id?: string
  is_read: boolean
  created_at: string
}

export interface Group {
  id: string
  name: string
  city: string
  state?: string
  country: string
  description?: string
  modality: string[]
  level: string
  is_free: boolean
  price_info?: string
  meeting_place?: string
  meeting_time?: string
  meeting_days: string[]
  pace_range?: string
  distance_range?: string
  needs_registration: boolean
  how_to_join?: string
  contact?: string
  instagram_url?: string
  is_active: boolean
  created_by?: string
  created_at: string
}
