'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import TermsModal from '@/components/bookings/TermsModal'

// Valores armazenados no banco — não traduzir os literais, só os rótulos exibidos.
const RUN_TYPE_VALUES = ['road', 'trail', 'track', 'beach', 'mountain', 'urban']
const SERVICE_VALUES = ['pace_guide', 'route_planning', 'race_prep', 'training_plan', 'photography', 'group_run']
const LANGUAGE_VALUES = ['pt', 'en', 'es', 'fr', 'de']
const EXPERIENCE_VALUES = ['menos de 1 ano', '1-2 anos', '3-5 anos', '5-10 anos', '10+ anos']

function buildSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    city: z.string().min(2, t('provideCityError')),
    country: z.string().min(1),
    bio: z.string().optional(),
    experience_years: z.string().optional(),
    modality_presential: z.boolean(),
    modality_virtual: z.boolean(),
    run_types: z.array(z.string()).min(1, t('selectRunTypeError')),
    services: z.array(z.string()).min(1, t('selectServiceError')),
    languages: z.array(z.string()).min(1, t('selectLanguageError')),
    is_paid: z.boolean(),
    price_brl: z.string().optional(),
    strava_url: z.string().optional(),
    instagram_url: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.is_paid) {
      const val = parseFloat(data.price_brl ?? '')
      if (!data.price_brl || isNaN(val) || val <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('provideValueError'), path: ['price_brl'] })
      }
    }
  })
}

type FormData = z.infer<ReturnType<typeof buildSchema>>

export default function CadastroGuiaPage() {
  const t = useTranslations('registerGuide')
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showTerms, setShowTerms] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const runTypeLabels: Record<string, string> = {
    road: t('runTypes.road'), trail: t('runTypes.trail'), track: t('runTypes.track'),
    beach: t('runTypes.beach'), mountain: t('runTypes.mountain'), urban: t('runTypes.urban'),
  }
  const serviceLabels: Record<string, string> = {
    pace_guide: t('services.pace_guide'), route_planning: t('services.route_planning'),
    race_prep: t('services.race_prep'), training_plan: t('services.training_plan'),
    photography: t('services.photography'), group_run: t('services.group_run'),
  }
  const languageLabels: Record<string, string> = {
    pt: t('languages.pt'), en: t('languages.en'), es: t('languages.es'), fr: t('languages.fr'), de: t('languages.de'),
  }
  const experienceLabels: Record<string, string> = {
    'menos de 1 ano': t('experience.lessThan1'),
    '1-2 anos': t('experience.oneToTwo'),
    '3-5 anos': t('experience.threeToFive'),
    '5-10 anos': t('experience.fiveToTen'),
    '10+ anos': t('experience.tenPlus'),
  }

  const schema = buildSchema(t)
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: 'BR',
      is_paid: false,
      modality_presential: true,
      modality_virtual: false,
      run_types: [],
      services: [],
      languages: ['pt'],
    },
  })

  const isPaid = watch('is_paid')
  const selectedRunTypes = watch('run_types')
  const selectedServices = watch('services')
  const selectedLanguages = watch('languages')

  const toggleArray = (field: 'run_types' | 'services' | 'languages', value: string, current: string[]) => {
    if (current.includes(value)) {
      setValue(field, current.filter((v) => v !== value), { shouldValidate: true })
    } else {
      setValue(field, [...current, value], { shouldValidate: true })
    }
  }

  const onSubmit = async (data: FormData) => {
    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const modality: string[] = []
    if (data.modality_presential) modality.push('presential')
    if (data.modality_virtual) modality.push('virtual')

    const { error: guideError } = await supabase.from('guides').upsert({
      id: user.id,
      city: data.city,
      country: data.country,
      bio: data.bio,
      experience_years: data.experience_years || null,
      modality,
      run_types: data.run_types,
      services: data.services,
      languages: data.languages,
      is_paid: data.is_paid,
      price_brl: data.is_paid && data.price_brl ? parseFloat(data.price_brl) : null,
      strava_url: data.strava_url || null,
      instagram_url: data.instagram_url || null,
      is_active: false,
    })

    if (guideError) {
      setError(t('errorCreatingProfile') + ': ' + guideError.message)
      return
    }

    await supabase.from('profiles').update({ role: 'both' }).eq('id', user.id)

    router.push('/guia/dashboard')
    router.refresh()
  }

  const inputClass = 'w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all'
  const checkboxItemClass = 'flex items-center gap-2 p-3 border border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#F5A623] transition-colors text-sm font-medium select-none'
  const checkboxItemActiveClass = 'border-[#F5A623] bg-[#FEF3DC]'

  return (
    <>
      {showTerms && (
        <TermsModal
          variant="guide"
          onAccept={() => { setTermsAccepted(true); setShowTerms(false) }}
          onClose={() => setShowTerms(false)}
        />
      )}

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Image
            src="/images/logo/pacehive-vertical-dark.svg"
            alt="PaceHive"
            width={70}
            height={88}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-extrabold text-[#1A1A1A]">{t('title')}</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
            )}

            {/* Cidade + País */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('city')} *</label>
                <input type="text" {...register('city')} placeholder={t('cityPlaceholder')} className={inputClass} />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('country')}</label>
                <input type="text" {...register('country')} placeholder="BR" className={inputClass} />
              </div>
            </div>

            {/* Modalidade */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">{t('modality')} *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { field: 'modality_presential' as const, label: t('presential') },
                  { field: 'modality_virtual' as const, label: t('virtual') },
                ].map((opt) => (
                  <label key={opt.field}
                    className="flex items-center gap-2 p-3 border border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#F5A623] transition-colors has-[:checked]:border-[#F5A623] has-[:checked]:bg-[#FEF3DC]">
                    <input type="checkbox" {...register(opt.field)} className="accent-[#F5A623]" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipo de corrida */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                {t('runType')} * <span className="text-[#6B6B6B] font-normal">{t('selectAllApplicable')}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RUN_TYPE_VALUES.map((value) => {
                  const active = selectedRunTypes.includes(value)
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleArray('run_types', value, selectedRunTypes)}
                      className={`${checkboxItemClass} ${active ? checkboxItemActiveClass : ''}`}
                    >
                      <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs transition-colors ${active ? 'bg-[#F5A623] border-[#F5A623] text-black' : 'border-[#D0D0D0]'}`}>
                        {active && '✓'}
                      </span>
                      {runTypeLabels[value]}
                    </button>
                  )
                })}
              </div>
              {errors.run_types && <p className="text-xs text-red-500 mt-1">{errors.run_types.message}</p>}
            </div>

            {/* Serviços */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                {t('servicesOffered')} * <span className="text-[#6B6B6B] font-normal">{t('selectAllApplicable')}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SERVICE_VALUES.map((value) => {
                  const active = selectedServices.includes(value)
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleArray('services', value, selectedServices)}
                      className={`${checkboxItemClass} ${active ? checkboxItemActiveClass : ''}`}
                    >
                      <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs transition-colors ${active ? 'bg-[#F5A623] border-[#F5A623] text-black' : 'border-[#D0D0D0]'}`}>
                        {active && '✓'}
                      </span>
                      {serviceLabels[value]}
                    </button>
                  )
                })}
              </div>
              {errors.services && <p className="text-xs text-red-500 mt-1">{errors.services.message}</p>}
            </div>

            {/* Idiomas */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">{t('languagesSpoken')} *</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_VALUES.map((value) => {
                  const active = selectedLanguages.includes(value)
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleArray('languages', value, selectedLanguages)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${active ? 'bg-[#F5A623] border-[#F5A623] text-black' : 'border-[#E5E5E5] text-[#6B6B6B] hover:border-[#F5A623]'}`}
                    >
                      {languageLabels[value]}
                    </button>
                  )
                })}
              </div>
              {errors.languages && <p className="text-xs text-red-500 mt-1">{errors.languages.message}</p>}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('bio')}</label>
              <textarea {...register('bio')} rows={4} placeholder={t('bioPlaceholder')}
                className={`${inputClass} resize-none`} />
            </div>

            {/* Experiência */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('runningExperience')}</label>
              <select {...register('experience_years')} className={`${inputClass} bg-white`}>
                <option value="">{t('select')}</option>
                {EXPERIENCE_VALUES.map((value) => (
                  <option key={value} value={value}>{experienceLabels[value]}</option>
                ))}
              </select>
            </div>

            {/* Cobrança */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input type="checkbox" {...register('is_paid')} className="accent-[#F5A623]" />
                <span className="text-sm font-medium text-[#1A1A1A]">{t('willCharge')}</span>
              </label>
              {isPaid && (
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('pricePerRun')} *</label>
                  <input type="number" step="1" min="1" {...register('price_brl')} placeholder={t('pricePlaceholder')}
                    className={inputClass} />
                  {errors.price_brl && <p className="text-xs text-red-500 mt-1">{errors.price_brl.message}</p>}
                </div>
              )}
            </div>

            {/* Links sociais */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('stravaUrl')}</label>
                <input type="url" {...register('strava_url')} placeholder="https://strava.com/athletes/..."
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('instagramUrl')}</label>
                <input type="url" {...register('instagram_url')} placeholder="https://instagram.com/..."
                  className={inputClass} />
              </div>
            </div>

            {/* Termos */}
            <div className="flex items-center justify-between gap-3">
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

            <button type="submit" disabled={isSubmitting || !termsAccepted}
              className="w-full py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? t('saving') : t('createProfile')}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
