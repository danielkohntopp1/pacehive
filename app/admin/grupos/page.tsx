import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import ConfirmForm from '@/components/admin/ConfirmForm'
import { adminDeleteGroup } from '../actions'
import type { Group } from '@/types'

export default async function AdminGruposPage() {
  const supabase = await createAdminClient()
  const { data: groups } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: false })

  const list = (groups ?? []) as Group[]

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Grupos</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{list.length} grupos cadastrados</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#E5E5E5] bg-[#F9F5EE]">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Grupo</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide hidden md:table-cell">Modalidade</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {list.map(group => (
              <tr key={group.id} className="hover:bg-[#F9F5EE] transition-colors">
                <td className="px-5 py-4">
                  <p className="font-semibold text-[#1A1A1A]">{group.name}</p>
                  <div className="flex items-center gap-1 text-xs text-[#6B6B6B] mt-0.5">
                    <MapPin size={11} className="text-[#F5A623]" />
                    {group.city}{group.state ? `, ${group.state}` : ''}
                  </div>
                </td>
                <td className="px-5 py-4 text-[#6B6B6B] hidden md:table-cell">
                  {group.modality?.length > 0 ? group.modality.join(', ') : '—'}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    group.is_active ? 'bg-green-100 text-green-700' : 'bg-[#F9F5EE] text-[#6B6B6B]'
                  }`}>
                    {group.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/grupos/${group.id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F5A623]/10 text-[#E09510] hover:bg-[#F5A623]/20 transition-colors">
                      Editar
                    </Link>
                    <ConfirmForm
                      action={adminDeleteGroup}
                      confirmMessage={`Excluir o grupo "${group.name}"?`}
                      hiddenFields={{ id: group.id }}
                      buttonLabel="Excluir"
                      buttonClass="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-[#6B6B6B] text-sm">
                  Nenhum grupo cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
