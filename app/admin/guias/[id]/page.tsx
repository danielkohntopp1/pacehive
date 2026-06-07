import { createAdminClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { updateGuide } from '../../actions'
import type { Guide, Profile } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

const EXPERIENCE_OPTIONS = [
  'menos de 1 ano', '1-2 anos', '3-5 anos', '5-10 anos', '10+ anos',
]

export default async function AdminEditGuiaPage({ params }: Props) {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data } = await supabase
    .from('guides')
    .select('*, profile:profiles(name, email)')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const guide = data as Guide & { profile: Profile }

  const inputClass = 'w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all bg-white'

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/guias" className="text-sm text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
          ← Guias
        </Link>
        <span className="text-[#E5E5E5]">/</span>
        <span className="text-sm font-semibold text-[#1A1A1A]">{guide.profile?.name}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Editar guia</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{guide.profile?.email}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <form action={updateGuide} className="space-y-5">
          <input type="hidden" name="id" value={guide.id} />

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Status</label>
            <div className="flex gap-3">
              {[{ value: 'true', label: 'Ativo' }, { value: 'false', label: 'Inativo' }].map((opt) => (
                <label key={opt.value}
                  className="flex items-center gap-2 p-3 border border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#F5A623] transition-colors has-[:checked]:border-[#F5A623] has-[:checked]:bg-[#FEF3DC] flex-1">
                  <input
                    type="radio"
                    name="is_active"
                    value={opt.value}
                    defaultChecked={guide.is_active ? opt.value === 'true' : opt.value === 'false'}
                    className="accent-[#F5A623]"
                  />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cidade e País */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Cidade</label>
              <input type="text" name="city" defaultValue={guide.city} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">País</label>
              <input type="text" name="country" defaultValue={guide.country} className={inputClass} />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Bio</label>
            <textarea name="bio" rows={4} defaultValue={guide.bio ?? ''}
              className={`${inputClass} resize-none`} />
          </div>

          {/* Experiência */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Experiência</label>
            <select name="experience_years" defaultValue={guide.experience_years ?? ''} className={inputClass}>
              <option value="">Não informado</option>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Cobrança */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                name="is_paid"
                value="true"
                defaultChecked={guide.is_paid}
                className="accent-[#F5A623]"
              />
              <span className="text-sm font-medium text-[#1A1A1A]">Cobra pelo serviço</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Valor (R$)</label>
              <input type="number" name="price_brl" defaultValue={guide.price_brl ?? ''} step="1" min="0" className={inputClass} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm">
              Salvar alterações
            </button>
            <Link href="/admin/guias"
              className="px-6 py-3 border border-[#E5E5E5] text-[#6B6B6B] font-semibold rounded-full hover:bg-[#F9F5EE] transition-colors text-sm text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
