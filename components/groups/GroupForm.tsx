'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import type { Group } from '@/types'

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

function PillSelect({ label, options, selected, onChange }: {
  label: string
  options: string[]
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
            {opt}
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

export default function GroupForm({ action, initialData, redirectTo, submitLabel = 'Salvar', showIsActive = false }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [modality, setModality] = useState<string[]>(initialData?.modality ?? [])
  const [days, setDays] = useState<string[]>(initialData?.meeting_days ?? [])
  const [isFree, setIsFree] = useState(initialData?.is_free ?? true)
  const [needsReg, setNeedsReg] = useState(initialData?.needs_registration ?? false)
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)

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
        setError(err instanceof Error ? err.message : 'Erro ao salvar grupo')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações básicas */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-bold text-[#1A1A1A]">Informações básicas</h2>
        <Field label="Nome do grupo" required>
          <input name="name" defaultValue={initialData?.name} required
            placeholder="Ex: Turma da Madrugada" className={inputCls} />
        </Field>
        <Field label="Descrição">
          <textarea name="description" defaultValue={initialData?.description} rows={3}
            placeholder="Apresente o grupo em suas próprias palavras..."
            className={inputCls + ' resize-none'} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cidade" required>
            <input name="city" defaultValue={initialData?.city} required
              placeholder="São Paulo" className={inputCls} />
          </Field>
          <Field label="Estado">
            <input name="state" defaultValue={initialData?.state}
              placeholder="SP" className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Modalidade e nível */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-bold text-[#1A1A1A]">Modalidade e nível</h2>
        <PillSelect label="Modalidade" options={MODALITIES} selected={modality} onChange={setModality} />
        <Field label="Nível">
          <select name="level" defaultValue={initialData?.level ?? 'Todos os níveis'} className={inputCls}>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ritmo médio">
            <input name="pace_range" defaultValue={initialData?.pace_range}
              placeholder="Ex: 5:30–7:00 min/km" className={inputCls} />
          </Field>
          <Field label="Distância típica">
            <input name="distance_range" defaultValue={initialData?.distance_range}
              placeholder="Ex: 8–15km" className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Horários e local */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-bold text-[#1A1A1A]">Horários e local</h2>
        <PillSelect label="Dias da semana" options={DAYS} selected={days} onChange={setDays} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Horário">
            <input type="time" name="meeting_time"
              defaultValue={initialData?.meeting_time?.slice(0, 5)} className={inputCls} />
          </Field>
          <Field label="Local de encontro">
            <input name="meeting_place" defaultValue={initialData?.meeting_place}
              placeholder="Ex: Parque Ibirapuera — Portão 10" className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Participação */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-bold text-[#1A1A1A]">Participação</h2>
        <Toggle label="Gratuito" description="O grupo não cobra nenhuma taxa" checked={isFree} onChange={setIsFree} />
        {!isFree && (
          <Field label="Informações sobre o valor">
            <input name="price_info" defaultValue={initialData?.price_info}
              placeholder="Ex: R$30/mês, inclui assessoria" className={inputCls} />
          </Field>
        )}
        <Toggle label="Precisa de agendamento" description="O corredor deve avisar antes de participar" checked={needsReg} onChange={setNeedsReg} />
        <Field label="Como participar">
          <textarea name="how_to_join" defaultValue={initialData?.how_to_join} rows={2}
            placeholder="Ex: Só aparecer! / Entre em contato pelo Instagram antes."
            className={inputCls + ' resize-none'} />
        </Field>
      </div>

      {/* Contato */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-bold text-[#1A1A1A]">Contato e redes sociais</h2>
        <Field label="Contato (WhatsApp, email ou telefone)">
          <input name="contact" defaultValue={initialData?.contact}
            placeholder="Ex: (11) 99999-9999" className={inputCls} />
        </Field>
        <Field label="Instagram">
          <input name="instagram_url" defaultValue={initialData?.instagram_url}
            placeholder="https://instagram.com/seugrupo" className={inputCls} />
        </Field>
      </div>

      {showIsActive && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <Toggle label="Grupo ativo (visível para corredores)" checked={isActive} onChange={setIsActive} />
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
        {isPending ? 'Salvando...' : submitLabel}
      </button>
    </form>
  )
}
