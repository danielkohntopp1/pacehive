'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const schema = z.object({
  city: z.string().min(2, 'Informe a cidade'),
  country: z.string().min(1),
  bio: z.string().optional(),
  experience_years: z.string().optional(),
  modality_presential: z.boolean(),
  modality_virtual: z.boolean(),
  is_paid: z.boolean(),
  price_brl: z.string().optional(),
  strava_url: z.string().optional(),
  instagram_url: z.string().optional(),
  schedule: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function CadastroGuiaPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: 'BR',
      is_paid: false,
      modality_presential: true,
    },
  })

  const isPaid = watch('is_paid')

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
      experience_years: data.experience_years,
      modality,
      is_paid: data.is_paid,
      price_brl: data.is_paid && data.price_brl ? parseFloat(data.price_brl) : null,
      strava_url: data.strava_url || null,
      instagram_url: data.instagram_url || null,
      schedule: data.schedule,
      languages: ['pt'],
      run_types: [],
      services: [],
    })

    if (guideError) {
      setError('Erro ao criar perfil de guia: ' + guideError.message)
      return
    }

    // Update role to 'both'
    await supabase.from('profiles').update({ role: 'both' }).eq('id', user.id)

    router.push('/guia/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-8">
        <Image
          src="/images/logo/pacehive-vertical-dark.svg"
          alt="PaceHive"
          width={70}
          height={88}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Complete seu perfil de guia</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Estas informações aparecerão no seu perfil público</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Cidade *</label>
              <input type="text" {...register('city')} placeholder="Ex: São Paulo"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">País</label>
              <input type="text" {...register('country')} placeholder="BR"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Modalidade *</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { field: 'modality_presential' as const, label: 'Presencial' },
                { field: 'modality_virtual' as const, label: 'Virtual' },
              ].map((opt) => (
                <label key={opt.field}
                  className="flex items-center gap-2 p-3 border border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#F5A623] transition-colors has-[:checked]:border-[#F5A623] has-[:checked]:bg-[#FEF3DC]">
                  <input type="checkbox" {...register(opt.field)} className="accent-[#F5A623]" />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Bio</label>
            <textarea {...register('bio')} rows={4} placeholder="Conte um pouco sobre você como guia e corredor..."
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Anos de experiência correndo</label>
            <input type="text" {...register('experience_years')} placeholder="Ex: 5 anos"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Disponibilidade</label>
            <textarea {...register('schedule')} rows={2}
              placeholder="Ex: Fins de semana pela manhã, ou mediante combinação."
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none" />
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input type="checkbox" {...register('is_paid')} className="accent-[#F5A623]" />
              <span className="text-sm font-medium text-[#1A1A1A]">Vou cobrar pelo serviço</span>
            </label>
            {isPaid && (
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Valor por corrida (R$)</label>
                <input type="number" step="10" min="0" {...register('price_brl')} placeholder="Ex: 150"
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Strava (URL)</label>
              <input type="url" {...register('strava_url')} placeholder="https://strava.com/athletes/..."
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
              {errors.strava_url && <p className="text-xs text-red-500 mt-1">{errors.strava_url.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Instagram (URL)</label>
              <input type="url" {...register('instagram_url')} placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
              {errors.instagram_url && <p className="text-xs text-red-500 mt-1">{errors.instagram_url.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Salvando...' : 'Criar meu perfil de guia →'}
          </button>
        </form>
      </div>
    </div>
  )
}
