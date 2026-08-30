'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { GuideAvailability } from '@/types'

const DAY_VALUES = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const PERIOD_VALUES = ['morning', 'afternoon', 'evening']

const emptyAvailability = (): GuideAvailability => ({ days: [], periods: [], notes: '' })

export default function DisponibilidadePage() {
  const t = useTranslations('availabilityPage')
  const [isActive, setIsActive] = useState(true)
  const [availability, setAvailability] = useState<GuideAvailability>(emptyAvailability())
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('guides').select('is_active, availability').eq('id', user.id).single().then(({ data }) => {
        if (data) {
          setIsActive(data.is_active)
          if (data.availability) setAvailability(data.availability as GuideAvailability)
        }
      })
    })
  }, [])

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }))
  }

  const togglePeriod = (period: string) => {
    setAvailability((prev) => ({
      ...prev,
      periods: prev.periods.includes(period) ? prev.periods.filter((p) => p !== period) : [...prev.periods, period],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const { error: e } = await supabase.from('guides')
      .update({ is_active: isActive, availability })
      .eq('id', user.id)

    setSaving(false)
    if (e) { setError(t('saveError')); return }
    setSuccess(true)
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">{t('title')}</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{t('subtitle')}</p>
      </div>

      <div className="space-y-4">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
            {t('availabilityUpdated')}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
        )}

        {/* Ativo/Inativo */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <button
            type="button"
            onClick={() => setIsActive((v) => !v)}
            className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-colors ${isActive ? 'border-[#F5A623] bg-[#FEF3DC]' : 'border-[#E5E5E5] hover:border-[#F5A623]'}`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-[#F5A623] border-[#F5A623]' : 'border-[#D0D0D0]'}`}>
              {isActive && <span className="text-black text-xs font-bold">✓</span>}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#1A1A1A]">{t('availableForBookings')}</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">{t('deactivateHint')}</p>
            </div>
          </button>
        </div>

        {/* Dias da semana */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-3">{t('availableDays')}</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {DAY_VALUES.map((value) => {
              const active = availability.days.includes(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleDay(value)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-colors ${active ? 'bg-[#F5A623] text-black' : 'bg-[#F9F5EE] text-[#6B6B6B] hover:bg-[#FEF3DC]'}`}
                >
                  {t(`days.${value}`)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Períodos */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-3">{t('periodsOfDay')}</h2>
          <div className="grid grid-cols-3 gap-3">
            {PERIOD_VALUES.map((value) => {
              const active = availability.periods.includes(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => togglePeriod(value)}
                  className={`p-3 rounded-xl border text-center transition-colors ${active ? 'border-[#F5A623] bg-[#FEF3DC]' : 'border-[#E5E5E5] hover:border-[#F5A623]'}`}
                >
                  <p className={`text-sm font-semibold ${active ? 'text-[#1A1A1A]' : 'text-[#6B6B6B]'}`}>{t(`periods.${value}.label`)}</p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">{t(`periods.${value}.sub`)}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Observações */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-3">{t('additionalNotes')}</h2>
          <textarea
            value={availability.notes ?? ''}
            onChange={(e) => setAvailability((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
            placeholder={t('notesPlaceholder')}
            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? t('saving') : t('saveAvailability')}
        </button>
      </div>
    </div>
  )
}
