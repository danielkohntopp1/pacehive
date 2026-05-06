'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
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
          reset({ name: data.name, phone: data.phone, language: data.language })
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
      <h1 className="text-2xl font-extrabold text-[#1A1A1A] mb-6">Meu perfil</h1>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <div className="w-16 h-16 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-extrabold text-2xl mb-6">
          {profile.name.charAt(0).toUpperCase()}
        </div>

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
