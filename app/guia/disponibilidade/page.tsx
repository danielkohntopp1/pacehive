'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FormData {
  schedule: string
  is_active: boolean
}

export default function DisponibilidadePage() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: { is_active: true },
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('guides').select('schedule, is_active').eq('id', user.id).single().then(({ data }) => {
        if (data) reset({ schedule: data.schedule ?? '', is_active: data.is_active })
      })
    })
  }, [reset])

  const onSubmit = async (data: FormData) => {
    setError(null)
    setSuccess(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error: e } = await supabase.from('guides')
      .update({ schedule: data.schedule, is_active: data.is_active })
      .eq('id', user.id)
    if (e) { setError('Erro ao salvar'); return }
    setSuccess(true)
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-extrabold text-[#1A1A1A] mb-6">Disponibilidade</h1>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
              Disponibilidade atualizada!
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#E5E5E5] rounded-xl hover:border-[#F5A623] transition-colors has-[:checked]:border-[#F5A623] has-[:checked]:bg-[#FEF3DC]">
              <input type="checkbox" {...register('is_active')} className="accent-[#F5A623]" />
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">Estou disponível para receber pedidos</p>
                <p className="text-xs text-[#6B6B6B] mt-0.5">Desmarque para pausar temporariamente</p>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              Descreva sua disponibilidade
            </label>
            <textarea
              {...register('schedule')}
              rows={5}
              placeholder={`Ex:\nSábados e domingos das 6h às 9h\nSemana: apenas mediante combinação\nFeriados: disponível`}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none"
            />
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Salvando...' : 'Salvar disponibilidade'}
          </button>
        </form>
      </div>
    </div>
  )
}
