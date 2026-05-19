'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Guide, StravaStats } from '@/types'
import StravaConnectCard from '@/components/strava/StravaConnectCard'

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
  const [stravaStats, setStravaStats] = useState<StravaStats | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [guideName, setGuideName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const isPaid = watch('is_paid')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      Promise.all([
        supabase.from('guides').select('*').eq('id', user.id).single(),
        supabase.from('profiles').select('name, avatar_url').eq('id', user.id).single(),
      ]).then(([guideRes, profileRes]) => {
        if (guideRes.data) {
          setGuide(guideRes.data as Guide)
          setStravaStats((guideRes.data.strava_stats as StravaStats) ?? null)
          reset({
            city: guideRes.data.city,
            country: guideRes.data.country,
            bio: guideRes.data.bio ?? '',
            experience_years: guideRes.data.experience_years ?? '',
            is_paid: guideRes.data.is_paid,
            price_brl: guideRes.data.price_brl?.toString() ?? '',
            strava_url: guideRes.data.strava_url ?? '',
            instagram_url: guideRes.data.instagram_url ?? '',
            schedule: guideRes.data.schedule ?? '',
          })
        }
        if (profileRes.data) {
          setAvatarUrl(profileRes.data.avatar_url ?? null)
          setGuideName(profileRes.data.name ?? '')
        }
      })
    })
  }, [reset])

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarError(null)

    if (!file.type.startsWith('image/')) {
      setAvatarError('Selecione uma imagem (JPG, PNG ou WebP).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Imagem muito grande. Máximo: 5 MB.')
      return
    }

    setAvatarUploading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setAvatarUploading(false); return }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setAvatarError('Erro ao enviar imagem. Tente novamente.')
      setAvatarUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    const urlWithBust = `${publicUrl}?t=${Date.now()}`

    await supabase.from('profiles').update({ avatar_url: urlWithBust }).eq('id', user.id)
    setAvatarUrl(urlWithBust)
    setAvatarUploading(false)
    // reset so same file can be re-selected if needed
    e.target.value = ''
  }

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

      <StravaConnectCard stravaStats={stravaStats} origin="/guia/perfil" />

      {/* Avatar section */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
        <p className="text-sm font-semibold text-[#1A1A1A] mb-4">Foto de perfil</p>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={avatarUploading}
            className="relative flex-shrink-0 group"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#F9F5EE] border-2 border-[#E5E5E5] group-hover:border-[#F5A623] transition-colors">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Foto de perfil"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-extrabold text-[#F5A623]">
                    {guideName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#F5A623] rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-[#E09510] transition-colors">
              {avatarUploading
                ? <Loader2 size={12} className="animate-spin text-black" />
                : <Camera size={12} className="text-black" />
              }
            </div>
          </button>

          <div>
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={avatarUploading}
              className="text-sm font-semibold text-[#F5A623] hover:underline disabled:opacity-50"
            >
              {avatarUploading ? 'Enviando...' : avatarUrl ? 'Trocar foto' : 'Adicionar foto'}
            </button>
            <p className="text-xs text-[#6B6B6B] mt-1">JPG, PNG ou WebP · máx. 5 MB</p>
            {avatarError && <p className="text-xs text-red-500 mt-1">{avatarError}</p>}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />
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
