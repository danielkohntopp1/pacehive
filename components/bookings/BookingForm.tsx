'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Guide, Profile } from '@/types'

const schema = z.object({
  city: z.string().min(2, 'Informe a cidade'),
  run_date: z.string().min(1, 'Informe a data'),
  run_time: z.string().min(1, 'Informe o horário'),
  modality: z.enum(['presential', 'virtual']),
  distance_km: z.string().optional(),
  pace: z.string().optional(),
  language: z.string().min(1),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  guide: Guide & { profile: Profile }
  onClose: () => void
}

export default function BookingForm({ guide, onClose }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        throw new Error(body.error || 'Erro ao criar pedido')
      }
      const booking = await res.json()
      onClose()
      router.push(`/dashboard/pedidos/${booking.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">Solicitar corrida</h2>
            <p className="text-sm text-[#6B6B6B]">com {guide.profile.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F9F5EE] transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Data *</label>
              <input
                type="date"
                {...register('run_date')}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
              {errors.run_date && <p className="text-xs text-red-500 mt-1">{errors.run_date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Horário *</label>
              <input
                type="time"
                {...register('run_time')}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
              {errors.run_time && <p className="text-xs text-red-500 mt-1">{errors.run_time.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Cidade *</label>
            <input
              type="text"
              {...register('city')}
              placeholder="Ex: São Paulo"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
            />
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Modalidade *</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'presential', label: 'Presencial' },
                { value: 'virtual', label: 'Virtual' },
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
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Distância (km)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                {...register('distance_km')}
                placeholder="Ex: 10"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Ritmo (min/km)</label>
              <input
                type="text"
                {...register('pace')}
                placeholder="Ex: 6:30"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Idioma preferido</label>
            <select
              {...register('language')}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all bg-white"
            >
              <option value="pt">Português</option>
              <option value="en">Inglês</option>
              <option value="es">Espanhol</option>
              <option value="fr">Francês</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Observações</label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Preferências especiais, nível de experiência, pontos de interesse..."
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Enviando pedido...' : 'Solicitar corrida'}
          </button>
        </form>
      </div>
    </div>
  )
}
