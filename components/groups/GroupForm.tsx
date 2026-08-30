'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import type { Group } from '@/types'

// Valores armazenados no banco — não traduzir os literais em si, só os rótulos exibidos.
const MODALITIES = ['Asfalto', 'Trail', 'Pista', 'Montanha']
const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const LEVELS = ['Todos os níveis', 'Iniciante', 'Intermediário', 'Avançado']

interface Props {
  action: (fd: FormData) => Promise<void>
  initialData?: Partial<Group>
  redirectTo: string
  submitLabel?: string
  showIsActive?: boolean
}

function PillSelect({ label, options, labels, selected, onChange }: {
  label: string
  options: string[]
  labels: Record<string, string>
  selected: string[]
  onChange: (val: string[]) => void
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(v => v !== opt) : [...selected, opt])
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selected.includes(opt)
                ? 'bg-[#F5A623] border-[#F5A623] text-black'
                : 'bg-white border-[#E5E5E5] text-[#6B6B6B] hover:border-[#F5A623]'
            }`}>
            {labels[opt] ?? opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function Toggle({ label, description, checked, onChange }: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-[#1A1A1A]">{label}</p>
        {description && <p className="text-xs text-[#6B6B6B]">{description}</p>}
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#F5A623]' : 'bg-[#E5E5E5]'}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-3.5 py-2.5 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all bg-white"

export default function GroupForm({ action, initialData, redirectTo, submitLabel, showIsActive = false }: Props) {
  const t = useTranslations('groupForm')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [modality, setModality] = useState<string[]>(initialData?.modality ?? [])
  const [days, setDays] = useState<string[]>(initialData?.meeting_days ?? [])
  const [isFree, setIsFree] = useState(initialData?.is_free ?? true)
  const [needsReg, setNeedsReg] = useState(initialData?.needs_registration ?? false)
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)

  const modalityLabels: Record<string, string> = {
    'Asfalto': t('modalityAsphalt'),
    'Trail': t('modalityTrail'),
    'Pista': t('modalityTrack'),
    'Montanha': t('modalityMountain'),
  }
  const dayLabels: Record<string, string> = {
    'Seg': t('dayMon'), 'Ter': t('dayTue'), 'Qua': t('dayWed'), 'Qui': t('dayThu'),
    'Sex': t('dayFri'), 'Sáb': t('daySat'), 'Dom': t('daySun'),
  }
  const levelLabels: Record<string, string> = {
    'Todos os níveis': t('levelAll'),
    'Iniciante': t('levelBeginner'),
    'Intermediário': t('levelIntermediate'),
    'Avançado': t('levelAdvanced'),
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    modality.forEach(m => fd.append('modality', m))
    days.forEach(d => fd.append('meeting_days', d))
    fd.set('is_free', String(isFree))
    fd.set('needs_registration', String(needsReg))
    if (showIsActive) fd.set('is_active', String(isActive))

    startTransition(async () => {
      try {
        await action(fd)
        window.location.href = redirectTo
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errorSaving'))
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações básicas */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-bold text-[#1A1A1A]">{t('basicInfo')}</h2>
        <Field label={t('groupName')} required>
          <input name="name" defaultValue={initialData?.name} required
            placeholder={t('groupNamePlaceholder')} className={inputCls} />
        </Field>
        <Field label={t('description')}>
          <textarea name="description" defaultValue={initialData?.description} rows={3}
            placeholder={t('descriptionPlaceholder')}
            className={inputCls + ' resize-none'} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('city')} required>
            <input name="city" defaultValue={initialData?.city} required
              placeholder={t('cityPlaceholder')} className={inputCls} />
          </Field>
          <Field label={t('state')}>
            <input name="state" defaultValue={initialData?.state}
              placeholder={t('statePlaceholder')} className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Modalidade e nível */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-bold text-[#1A1A1A]">{t('modalityAndLevel')}</h2>
        <PillSelect label={t('modality')} options={MODALITIES} labels={modalityLabels} selected={modality} onChange={setModality} />
        <Field label={t('level')}>
          <select name="level" defaultValue={initialData?.level ?? 'Todos os níveis'} className={inputCls}>
            {LEVELS.map(l => <option key={l} value={l}>{levelLabels[l]}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('avgPace')}>
            <input name="pace_range" defaultValue={initialData?.pace_range}
              placeholder={t('avgPacePlaceholder')} className={inputCls} />
          </Field>
          <Field label={t('typicalDistance')}>
            <input name="distance_range" defaultValue={initialData?.distance_range}
              placeholder={t('typicalDistancePlaceholder')} className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Horários e local */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-bold text-[#1A1A1A]">{t('scheduleAndLocation')}</h2>
        <PillSelect label={t('daysOfWeek')} options={DAYS} labels={dayLabels} selected={days} onChange={setDays} />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('time')}>
            <input type="time" name="meeting_time"
              defaultValue={initialData?.meeting_time?.slice(0, 5)} className={inputCls} />
          </Field>
          <Field label={t('meetingPlace')}>
            <input name="meeting_place" defaultValue={initialData?.meeting_place}
              placeholder={t('meetingPlacePlaceholder')} className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Participação */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-bold text-[#1A1A1A]">{t('participation')}</h2>
        <Toggle label={t('free')} description={t('freeDescription')} checked={isFree} onChange={setIsFree} />
        {!isFree && (
          <Field label={t('priceInfo')}>
            <input name="price_info" defaultValue={initialData?.price_info}
              placeholder={t('priceInfoPlaceholder')} className={inputCls} />
          </Field>
        )}
        <Toggle label={t('needsRegistration')} description={t('needsRegistrationDescription')} checked={needsReg} onChange={setNeedsReg} />
        <Field label={t('howToJoin')}>
          <textarea name="how_to_join" defaultValue={initialData?.how_to_join} rows={2}
            placeholder={t('howToJoinPlaceholder')}
            className={inputCls + ' resize-none'} />
        </Field>
      </div>

      {/* Contato */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-bold text-[#1A1A1A]">{t('contactAndSocial')}</h2>
        <Field label={t('contact')}>
          <input name="contact" defaultValue={initialData?.contact}
            placeholder={t('contactPlaceholder')} className={inputCls} />
        </Field>
        <Field label="Instagram">
          <input name="instagram_url" defaultValue={initialData?.instagram_url}
            placeholder="https://instagram.com/seugrupo" className={inputCls} />
        </Field>
      </div>

      {showIsActive && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <Toggle label={t('groupActive')} checked={isActive} onChange={setIsActive} />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button type="submit" disabled={isPending}
        className="w-full py-3.5 bg-[#F5A623] text-black font-bold rounded-xl hover:bg-[#E09510] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
        {isPending && <Loader2 size={16} className="animate-spin" />}
        {isPending ? t('saving') : (submitLabel ?? t('save'))}
      </button>
    </form>
  )
}
