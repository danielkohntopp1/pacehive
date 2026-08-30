'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { X, Loader2, CreditCard, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Guide, Profile, GuideAvailability } from '@/types'
import TermsModal from './TermsModal'

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

function formatAvailability(av: GuideAvailability, t: ReturnType<typeof useTranslations>): string {
  const days = DAY_ORDER.filter((d) => av.days.includes(d)).map((d) => t(`days.${d}`)).join(', ')
  const periods = av.periods.map((p) => t(`periods.${p}`)).join(', ')
  const parts = [days, periods].filter(Boolean)
  return parts.join(' · ')
}

function buildSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    city: z.string().min(2, t('provideCityError')),
    run_date: z.string().min(1, t('provideDateError')),
    run_time: z.string().min(1, t('provideTimeError')),
    modality: z.enum(['presential', 'virtual']),
    distance_km: z.string().optional(),
    pace: z.string().optional(),
    language: z.string().min(1),
    notes: z.string().optional(),
  })
}

type FormData = z.infer<ReturnType<typeof buildSchema>>

interface Props {
  guide: Guide & { profile: Profile }
  onClose: () => void
}

export default function BookingForm({ guide, onClose }: Props) {
  const t = useTranslations('bookingForm')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTerms, setShowTerms] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const schema = buildSchema(t)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: guide.city,
      modality: 'presential',
      language: 'pt',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          guide_id: guide.id,
          distance_km: data.distance_km ? parseFloat(data.distance_km) : undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || t('errorCreatingBooking'))
      }
      const booking = await res.json()
      onClose()
      router.push(`/dashboard/pedidos/${booking.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('unexpectedError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {showTerms && (
        <TermsModal
          variant="runner"
          onAccept={() => { setTermsAccepted(true); setShowTerms(false) }}
          onClose={() => setShowTerms(false)}
        />
      )}

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">{t('requestRun')}</h2>
            <p className="text-sm text-[#6B6B6B]">{t('withGuide', { name: guide.profile.name })}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F9F5EE] transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {guide.is_paid && guide.price_brl && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <CreditCard size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {t('guideCharges', { price: guide.price_brl.toFixed(0) })}
                </p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  {t('paymentDisclaimer')}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Guide availability hint */}
          {guide.availability && (guide.availability.days.length > 0 || guide.availability.periods.length > 0) && (
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Calendar size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800">{t('guideAvailability')}</p>
                <p className="text-xs text-blue-700 mt-0.5">{formatAvailability(guide.availability, t)}</p>
                {guide.availability.notes && (
                  <p className="text-xs text-blue-600 mt-1 leading-relaxed">{guide.availability.notes}</p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('date')} *</label>
              <input
                type="date"
                {...register('run_date')}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
              {errors.run_date && <p className="text-xs text-red-500 mt-1">{errors.run_date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('time')} *</label>
              <input
                type="time"
                {...register('run_time')}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
              {errors.run_time && <p className="text-xs text-red-500 mt-1">{errors.run_time.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('city')} *</label>
            <input
              type="text"
              {...register('city')}
              placeholder={t('cityPlaceholder')}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
            />
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">{t('modality')} *</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'presential', label: t('presential') },
                { value: 'virtual', label: t('virtual') },
              ].map((opt) => (
                <label key={opt.value}
                  className="flex items-center gap-2 p-3 border border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#F5A623] transition-colors has-[:checked]:border-[#F5A623] has-[:checked]:bg-[#FEF3DC]">
                  <input type="radio" value={opt.value} {...register('modality')} className="accent-[#F5A623]" />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                {t('distance')}
                <span className="text-[#6B6B6B] font-normal ml-1">{t('optional')}</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                {...register('distance_km')}
                placeholder={t('distancePlaceholder')}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
              <p className="text-xs text-[#6B6B6B] mt-1">{t('distanceHint')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                {t('currentPace')}
                <span className="text-[#6B6B6B] font-normal ml-1">{t('optional')}</span>
              </label>
              <input
                type="text"
                {...register('pace')}
                placeholder={t('pacePlaceholder')}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
              <p className="text-xs text-[#6B6B6B] mt-1">{t('paceHint')}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('preferredLanguage')}</label>
            <select
              {...register('language')}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all bg-white"
            >
              <option value="pt">{t('portuguese')}</option>
              <option value="en">{t('english')}</option>
              <option value="es">{t('spanish')}</option>
              <option value="fr">{t('french')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('notes')}</label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder={t('notesPlaceholder')}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="accent-[#F5A623] w-4 h-4"
              />
              <span className="text-sm text-[#6B6B6B]">{t('acceptTerms')}</span>
            </label>
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-sm text-[#F5A623] font-semibold hover:underline flex-shrink-0"
            >
              {t('viewTerms')}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? t('sendingRequest') : t('requestRunCta')}
          </button>
        </form>
      </div>
    </div>
    </>
  )
}
