import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { toggleGuideActive, removeGuideProfile } from '../actions'
import type { Guide, Profile } from '@/types'

export default async function AdminGuiasPage() {
  const supabase = await createAdminClient()
  const { data: guides } = await supabase
    .from('guides')
    .select('*, profile:profiles(id, name, email, avatar_url, is_banned)')
    .order('created_at', { ascending: false })

  const list = (guides ?? []) as (Guide & { profile: Profile })[]

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Guias</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{list.length} guias cadastrados</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#E5E5E5] bg-[#F9F5EE]">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Guia</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Cidade</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide hidden md:table-cell">Corridas</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {list.map((guide) => (
              <tr key={guide.id} className="hover:bg-[#F9F5EE] transition-colors">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">{guide.profile?.name}</p>
                    <p className="text-xs text-[#6B6B6B] truncate max-w-[200px]">{guide.profile?.email}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#6B6B6B]">{guide.city}, {guide.country}</td>
                <td className="px-5 py-4 text-[#6B6B6B] hidden md:table-cell">{guide.total_runs}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    guide.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-[#F9F5EE] text-[#6B6B6B]'
                  }`}>
                    {guide.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    {/* Toggle active */}
                    <form action={toggleGuideActive}>
                      <input type="hidden" name="id" value={guide.id} />
                      <input type="hidden" name="isActive" value={String(!guide.is_active)} />
                      <button type="submit"
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          guide.is_active
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}>
                        {guide.is_active ? 'Desativar' : 'Ativar'}
                      </button>
                    </form>

                    {/* Edit */}
                    <Link href={`/admin/guias/${guide.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F5A623]/10 text-[#E09510] hover:bg-[#F5A623]/20 transition-colors">
                      Editar
                    </Link>

                    {/* Remove guide profile */}
                    <form action={removeGuideProfile} onSubmit={(e) => {
                      if (!confirm(`Remover perfil de guia de ${guide.profile?.name}? O usuário continuará como corredor.`)) e.preventDefault()
                    }}>
                      <input type="hidden" name="id" value={guide.id} />
                      <button type="submit"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                        Remover guia
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#6B6B6B] text-sm">
                  Nenhum guia cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
