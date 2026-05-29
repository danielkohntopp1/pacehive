'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { GuideAvailability } from '@/types'

const DAYS = [
  { value: 'mon', label: 'Seg' },
  { value: 'tue', label: 'Ter' },
  { value: 'wed', label: 'Qua' },
  { value: 'thu', label: 'Qui' },
  { value: 'fri', label: 'Sex' },
  { value: 'sat', label: 'Sáb' },
  { value: 'sun', label: 'Dom' },
]

const PERIODS = [
  { value: 'morning', label: 'Manhã', sub: '5h – 12h' },
  { value: 'afternoon', label: 'Tarde', sub: '12h – 18h' },
  { value: 'evening', label: 'Noite', sub: '18h – 22h' },
]

const emptyAvailability = (): GuideAvailability => ({ days: [], periods: [], notes: '' })

export default function DisponibilidadePage() {
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
    if (e) { setError('Erro ao salvar'); return }
    setSuccess(true)
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Disponibilidade</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Informe quando você está disponível para receber pedidos</p>
      </div>

      <div className="space-y-4">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
            Disponibilidade atualizada!
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
              <p className="text-sm font-semibold text-[#1A1A1A]">Estou disponível para receber pedidos</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">Desative para pausar temporariamente sua visibilidade</p>
            </div>
          </button>
        </div>

        {/* Dias da semana */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-3">Dias disponíveis</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map((day) => {
              const active = availability.days.includes(day.value)
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-colors ${active ? 'bg-[#F5A623] text-black' : 'bg-[#F9F5EE] text-[#6B6B6B] hover:bg-[#FEF3DC]'}`}
                >
                  {day.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Períodos */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-3">Períodos do dia</h2>
          <div className="grid grid-cols-3 gap-3">
            {PERIODS.map((period) => {
              const active = availability.periods.includes(period.value)
              return (
                <button
                  key={period.value}
                  type="button"
                  onClick={() => togglePeriod(period.value)}
                  className={`p-3 rounded-xl border text-center transition-colors ${active ? 'border-[#F5A623] bg-[#FEF3DC]' : 'border-[#E5E5E5] hover:border-[#F5A623]'}`}
                >
                  <p className={`text-sm font-semibold ${active ? 'text-[#1A1A1A]' : 'text-[#6B6B6B]'}`}>{period.label}</p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">{period.sub}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Observações */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
          <h2 className="text-sm font-semibold text-[#1A1A1A] mb-3">Observações adicionais</h2>
          <textarea
            value={availability.notes ?? ''}
            onChange={(e) => setAvailability((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
            placeholder="Ex: Apenas sob agendamento antecipado de 48h. Feriados mediante consulta."
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
          {saving ? 'Salvando...' : 'Salvar disponibilidade'}
        </button>
      </div>
    </div>
  )
}
