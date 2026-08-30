'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  MapPin, Star, Users, ExternalLink, Award,
  CheckCircle2, Clock, Languages, Activity, Timer, TrendingUp
} from 'lucide-react'
import type { Guide, Profile, Review, GuideAvailability } from '@/types'
import { formatPace, formatDistance, formatLastActivity } from '@/lib/strava/client'
import BookingForm from '@/components/bookings/BookingForm'

interface Props {
  guide: Guide & { profile: Profile }
  reviews: (Review & { reviewer: Profile })[]
  isLoggedIn: boolean
}

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

function AvailabilityDisplay({ availability, schedule }: { availability?: GuideAvailability | null, schedule?: string }) {
  const t = useTranslations('guideProfile')
  const hasDays = availability?.days && availability.days.length > 0
  const hasPeriods = availability?.periods && availability.periods.length > 0
  if (!hasDays && !hasPeriods && !availability?.notes && !schedule) return null

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
        <Clock size={18} className="text-[#F5A623]" />
        {t('availability')}
      </h2>
      {hasDays && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {DAY_ORDER.filter((d) => availability!.days.includes(d)).map((d) => (
            <span key={d} className="bg-[#F5A623] text-black text-xs font-bold rounded-full px-2.5 py-1">{t(`days.${d}`)}</span>
          ))}
          {DAY_ORDER.filter((d) => !availability!.days.includes(d)).map((d) => (
            <span key={d} className="bg-[#F9F5EE] text-[#6B6B6B] text-xs font-medium rounded-full px-2.5 py-1">{t(`days.${d}`)}</span>
          ))}
        </div>
      )}
      {hasPeriods && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {availability!.periods.map((p) => (
            <span key={p} className="text-xs bg-[#FEF3DC] text-[#1A1A1A] font-medium px-2.5 py-1 rounded-full">{t(`periods.${p}`)}</span>
          ))}
        </div>
      )}
      {availability?.notes && <p className="text-[#6B6B6B] text-sm leading-relaxed">{availability.notes}</p>}
      {!hasDays && !hasPeriods && schedule && <p className="text-[#6B6B6B] text-sm leading-relaxed">{schedule}</p>}
    </div>
  )
}

export default function GuideProfile({ guide, reviews, isLoggedIn }: Props) {
  const t = useTranslations('guideProfile')
  const tFormat = useTranslations('stravaFormat')
  const locale = useLocale()
  const [showBookingForm, setShowBookingForm] = useState(false)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden mb-8">
        <div className="md:flex">
          {/* Photo */}
          <div className="md:w-72 flex-shrink-0">
            <div className="relative h-72 md:h-full bg-[#F9F5EE]">
              {guide.profile.avatar_url ? (
                <Image src={guide.profile.avatar_url} alt={guide.profile.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-7xl font-extrabold text-[#F5A623]">
                    {guide.profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-6 md:p-8 flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              {guide.modality.map((m) => (
                <span key={m} className="bg-[#F5A623] text-black text-sm font-semibold rounded-full px-3 py-1">
                  {t(`modality.${m}`)}
                </span>
              ))}
              {guide.is_paid && guide.price_brl ? (
                <span className="bg-[#0A0A0A] text-white text-sm font-semibold rounded-full px-3 py-1">
                  {t('pricePerRun', { price: guide.price_brl.toFixed(0) })}
                </span>
              ) : (
                <span className="bg-green-100 text-green-700 text-sm font-semibold rounded-full px-3 py-1">
                  {t('volunteer')}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-1">
              {guide.profile.name}
            </h1>

            <div className="flex items-center gap-1.5 text-[#6B6B6B] mb-4">
              <MapPin size={15} className="text-[#F5A623]" />
              <span className="text-sm">{guide.city}, {guide.country}</span>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-5">
              {guide.rating_count > 0 ? (
                <div className="flex items-center gap-1.5 text-sm">
                  <Star size={16} className="text-[#F5A623] fill-[#F5A623]" />
                  <span className="font-bold text-[#1A1A1A]">{guide.rating_avg.toFixed(1)}</span>
                  <span className="text-[#6B6B6B]">{t('reviewsCount', { count: guide.rating_count })}</span>
                </div>
              ) : (
                <span className="text-xs bg-[#F9F5EE] text-[#6B6B6B] font-medium px-2.5 py-1 rounded-full border border-[#E5E5E5]">
                  {t('newGuide')}
                </span>
              )}
              {guide.total_runs > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                  <Users size={16} />
                  <span>{t('runsCompleted', { count: guide.total_runs })}</span>
                </div>
              )}
              {guide.experience_years && (
                <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                  <Award size={16} />
                  <span>{t('yearsOfExperience', { years: guide.experience_years })}</span>
                </div>
              )}
            </div>

            {/* Languages */}
            {guide.languages.length > 0 && (
              <div className="flex items-center gap-2 mb-5">
                <Languages size={15} className="text-[#6B6B6B]" />
                <div className="flex flex-wrap gap-1.5">
                  {guide.languages.map((lang) => (
                    <span key={lang} className="text-xs bg-[#F9F5EE] text-[#6B6B6B] font-medium px-2.5 py-0.5 rounded-full">
                      {t.has(`languages.${lang}`) ? t(`languages.${lang}`) : lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social links */}
            {guide.instagram_url && (
              <div className="flex items-center gap-3 mb-6">
                <a href={guide.instagram_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
                  <ExternalLink size={14} />
                  Instagram
                </a>
              </div>
            )}

            {/* Strava verified block */}
            {guide.strava_stats && (
              <div className="bg-[#FFF4EE] border border-[#FC4C02]/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="#FC4C02" className="w-4 h-4"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169" /></svg>
                    <span className="text-xs font-bold text-[#FC4C02] uppercase tracking-wide">{t('stravaVerified')}</span>
                  </div>
                  {guide.strava_url && (
                    <a
                      href={guide.strava_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-[#FC4C02] hover:underline"
                    >
                      {t('viewProfile')}
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {guide.strava_stats.ytd_run_distance > 0 && (
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 text-[#FC4C02]">
                        <TrendingUp size={13} />
                        <span className="text-xs text-[#6B6B6B]">{t('kmThisYear', { year: new Date().getFullYear() })}</span>
                      </div>
                      <span className="font-bold text-[#1A1A1A] text-sm">{formatDistance(guide.strava_stats.ytd_run_distance, tFormat, locale as 'pt' | 'en')}</span>
                    </div>
                  )}
                  {guide.strava_stats.avg_pace && (
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 text-[#FC4C02]">
                        <Timer size={13} />
                        <span className="text-xs text-[#6B6B6B]">{t('avgPace')}</span>
                      </div>
                      <span className="font-bold text-[#1A1A1A] text-sm">{formatPace(guide.strava_stats.avg_pace)}/km</span>
                    </div>
                  )}
                  {guide.strava_stats.last_activity_at && (
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 text-[#FC4C02]">
                        <Activity size={13} />
                        <span className="text-xs text-[#6B6B6B]">{t('lastRun')}</span>
                      </div>
                      <span className="font-bold text-[#1A1A1A] text-sm">{formatLastActivity(guide.strava_stats.last_activity_at, tFormat)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            {isLoggedIn ? (
              <button
                onClick={() => setShowBookingForm(true)}
                className="px-8 py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
              >
                {t('requestRun')}
              </button>
            ) : (
              <Link
                href={`/login?redirect=/guias/${guide.id}`}
                className="inline-block px-8 py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
              >
                {t('signInToRequest')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Bio */}
        {guide.bio && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">{t('about')}</h2>
            <p className="text-[#6B6B6B] text-sm leading-relaxed">{guide.bio}</p>
          </div>
        )}

        {/* Run types */}
        {guide.run_types.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">{t('runType')}</h2>
            <div className="flex flex-wrap gap-2">
              {guide.run_types.map((rt) => (
                <span key={rt} className="text-sm bg-[#F9F5EE] text-[#1A1A1A] font-medium px-3 py-1.5 rounded-full">
                  {t.has(`runTypes.${rt}`) ? t(`runTypes.${rt}`) : rt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {guide.services.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">{t('servicesIncluded')}</h2>
            <ul className="space-y-2">
              {guide.services.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                  <CheckCircle2 size={15} className="text-[#F5A623] flex-shrink-0" />
                  {t.has(`services.${s}`) ? t(`services.${s}`) : s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <AvailabilityDisplay availability={guide.availability} schedule={guide.schedule} />
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-5 flex items-center gap-2">
            <Star size={18} className="text-[#F5A623] fill-[#F5A623]" />
            {t('reviewsHeading', { count: reviews.length })}
          </h2>
          <div className="space-y-5">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-[#E5E5E5] pb-5 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                      {review.reviewer?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-[#1A1A1A]">{review.reviewer?.name}</span>
                      <p className="text-xs text-[#6B6B6B]/60">
                        {new Date(review.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'text-[#F5A623] fill-[#F5A623]' : 'text-[#E5E5E5] fill-[#E5E5E5]'}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-[#6B6B6B] leading-relaxed pl-11">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          guide={guide}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  )
}
