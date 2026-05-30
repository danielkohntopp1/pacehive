import { createAdminClient } from '@/lib/supabase/server'
import { toggleBanUser, deleteUser } from '../actions'
import ConfirmForm from '@/components/admin/ConfirmForm'
import type { Profile } from '@/types'

const roleLabels: Record<string, string> = {
  runner: 'Corredor',
  guide: 'Guia',
  both: 'Corredor + Guia',
}

export default async function AdminCorredoresPage() {
  const supabase = await createAdminClient()

  const [{ data: profiles }, { data: bookingCounts }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('bookings').select('runner_id').then(({ data }) => ({
      data: data?.reduce((acc: Record<string, number>, b) => {
        acc[b.runner_id] = (acc[b.runner_id] || 0) + 1
        return acc
      }, {}) ?? {},
    })),
  ])

  const list = (profiles ?? []) as Profile[]
  const counts = bookingCounts as Record<string, number>

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Corredores & Usuários</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{list.length} usuários cadastrados</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[#E5E5E5] bg-[#F9F5EE]">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Usuário</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide hidden md:table-cell">Perfil</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide hidden lg:table-cell">Pedidos</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {list.map((profile) => (
              <tr key={profile.id} className={`hover:bg-[#F9F5EE] transition-colors ${profile.is_banned ? 'opacity-60' : ''}`}>
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">{profile.name}</p>
                    <p className="text-xs text-[#6B6B6B] truncate max-w-[200px]">{profile.email}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#6B6B6B] hidden md:table-cell">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    profile.role === 'both' ? 'bg-[#FEF3DC] text-[#E09510]' :
                    profile.role === 'guide' ? 'bg-blue-50 text-blue-600' :
                    'bg-[#F9F5EE] text-[#6B6B6B]'
                  }`}>
                    {roleLabels[profile.role] ?? profile.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-[#6B6B6B] hidden lg:table-cell">
                  {counts[profile.id] ?? 0} pedidos
                </td>
                <td className="px-5 py-4">
                  {profile.is_banned ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      Banido
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Ativo
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Ban / Unban */}
                    <form action={toggleBanUser}>
                      <input type="hidden" name="id" value={profile.id} />
                      <input type="hidden" name="isBanned" value={String(!profile.is_banned)} />
                      <button type="submit"
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          profile.is_banned
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}>
                        {profile.is_banned ? 'Desbanir' : 'Banir'}
                      </button>
                    </form>

                    {/* Delete */}
                    <ConfirmForm
                      action={deleteUser}
                      confirmMessage={`Excluir permanentemente a conta de ${profile.name}? Esta ação não pode ser desfeita.`}
                      hiddenFields={{ id: profile.id }}
                      buttonLabel="Excluir"
                      buttonClass="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    />
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#6B6B6B] text-sm">
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
