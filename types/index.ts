export type UserRole = 'runner' | 'guide' | 'both'
export type BookingStatus = 'pending' | 'accepted' | 'refused' | 'completed' | 'cancelled'
export type Modality = 'presential' | 'virtual'

export interface Profile {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  avatar_url?: string
  language: string
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
  languages: string[]
  is_active: boolean
  rating_avg: number
  rating_count: number
  total_runs: number
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
  is_free: boolean
  meeting_place?: string
  meeting_time?: string
  meeting_days: string[]
  how_to_join?: string
  contact?: string
  instagram_url?: string
  is_active: boolean
  created_at: string
}
