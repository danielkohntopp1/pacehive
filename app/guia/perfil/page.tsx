'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Guide } from '@/types'

const schema = z.object({
  city: z.string().min(2, 'Informe a cidade'),
  country: z.string().min(1),
  bio: z.string().optional(),
  experience_years: z.string().optional(),
  is_paid: z.boolean(),
  price_brl: z.string().optional(),
  strava_url: z.string().optional(),
  instagram_url: z.string().optional(),
  schedule: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function GuiaPerfilPage() {
  const [guide, setGuide] = useState<Guide | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const isPaid = watch('is_paid')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('guides').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) {
          setGuide(data as Guide)
          reset({
            city: data.city,
            country: data.country,
            bio: data.bio ?? '',
            experience_years: data.experience_years ?? '',
            is_paid: data.is_paid,
            price_brl: data.price_brl?.toString() ?? '',
            strava_url: data.strava_url ?? '',
            instagram_url: data.instagram_url ?? '',
            schedule: data.schedule ?? '',
          })
        }
      })
    })
  }, [reset])

  const onSubmit = async (data: FormData) => {
    setError(null)
    setSuccess(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: updateError } = await supabase.from('guides').update({
      ...data,
      price_brl: data.is_paid && data.price_brl ? parseFloat(data.price_brl) : null,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    if (updateError) { setError('Erro ao salvar'); return }
    setSuccess(true)
  }

  if (!guide) return <div className="text-[#6B6B6B] text-sm">Carregando...</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Meu perfil público</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Estas informações são exibidas para corredores que buscam guias</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
              Perfil atualizado com sucesso!
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Cidade *</label>
              <input type="text" {...register('city')}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">País</label>
              <input type="text" {...register('country')}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Bio</label>
            <textarea {...register('bio')} rows={4}
              placeholder="Conte sobre você como guia e corredor..."
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Disponibilidade</label>
            <textarea {...register('schedule')} rows={2}
              placeholder="Ex: Fins de semana, manhãs..."
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none" />
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input type="checkbox" {...register('is_paid')} className="accent-[#F5A623]" />
              <span className="text-sm font-medium text-[#1A1A1A]">Cobro pelo serviço</span>
            </label>
            {isPaid && (
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Valor por corrida (R$)</label>
                <input type="number" step="10" min="0" {...register('price_brl')}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Strava</label>
              <input type="url" {...register('strava_url')} placeholder="https://..."
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Instagram</label>
              <input type="url" {...register('instagram_url')} placeholder="https://..."
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}
