'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  phone: z.string().optional(),
  language: z.string().min(1),
})

type FormData = z.infer<typeof schema>

export default function RunnerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) {
          setProfile(data as Profile)
          setAvatarUrl(data.avatar_url ?? null)
          reset({ name: data.name, phone: data.phone, language: data.language })
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
    e.target.value = ''
  }

  const onSubmit = async (data: FormData) => {
    setError(null)
    setSuccess(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (updateError) { setError('Erro ao salvar'); return }
    setSuccess(true)
  }

  if (!profile) return <div className="text-[#6B6B6B] text-sm">Carregando...</div>

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Meu perfil</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Suas informações pessoais e preferências</p>
      </div>

      {/* Avatar */}
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
                    {profile.name.charAt(0).toUpperCase()}
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
            <p className="text-sm font-medium text-[#1A1A1A]">Clique para alterar a foto</p>
            <p className="text-xs text-[#6B6B6B] mt-0.5">JPG, PNG ou WebP · Máximo 5 MB</p>
            {avatarError && <p className="text-xs text-red-500 mt-1">{avatarError}</p>}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Dados */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
              Perfil atualizado com sucesso!
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Nome</label>
            <input type="text" {...register('name')}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">E-mail</label>
            <input type="email" value={profile.email} disabled
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm bg-[#F9F5EE] text-[#6B6B6B]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">WhatsApp</label>
            <input type="tel" {...register('phone')} placeholder="+55 11 99999-9999"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Idioma preferido</label>
            <select {...register('language')}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all bg-white">
              <option value="pt">Português</option>
              <option value="en">Inglês</option>
              <option value="es">Espanhol</option>
            </select>
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
