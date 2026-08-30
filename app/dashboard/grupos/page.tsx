import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PlusCircle, MapPin, Clock, Pencil } from 'lucide-react'
import ConfirmForm from '@/components/admin/ConfirmForm'
import { getTranslations } from 'next-intl/server'
import { deleteOwnGroup } from './actions'
import type { Group } from '@/types'

export default async function MeusGruposPage() {
  const supabase = await createClient()
  const t = await getTranslations('myGroupsPage')
  const { data: { user } } = await supabase.auth.getUser()

  const { data: groups } = await supabase
    .from('groups')
    .select('*')
    .eq('created_by', user!.id)
    .order('created_at', { ascending: false })

  const list = (groups ?? []) as Group[]

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A1A]">{t('title')}</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{t('groupsRegistered', { count: list.length })}</p>
        </div>
        <Link href="/dashboard/grupos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F5A623] text-black font-semibold rounded-xl hover:bg-[#E09510] transition-colors text-sm">
          <PlusCircle size={16} />
          {t('newGroup')}
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center">
          <div className="w-14 h-14 bg-[#FEF3DC] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin size={22} className="text-[#F5A623]" />
          </div>
          <p className="font-bold text-[#1A1A1A] mb-1">{t('noGroupsYet')}</p>
          <p className="text-[#6B6B6B] text-sm mb-5">{t('registerAndAppear')}</p>
          <Link href="/dashboard/grupos/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5A623] text-black font-semibold rounded-xl hover:bg-[#E09510] transition-colors text-sm">
            <PlusCircle size={15} />
            {t('registerGroup')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(group => (
            <div key={group.id} className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-[#1A1A1A]">{group.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      group.is_active ? 'bg-green-100 text-green-700' : 'bg-[#F9F5EE] text-[#6B6B6B]'
                    }`}>
                      {group.is_active ? t('active') : t('inactive')}
                    </span>
                    {group.is_free && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{t('free')}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#6B6B6B] mb-2">
                    <MapPin size={13} className="text-[#F5A623]" />
                    {group.city}{group.state ? `, ${group.state}` : ''}
                  </div>
                  {group.meeting_days.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-[#6B6B6B]">
                      <Clock size={12} className="text-[#F5A623]" />
                      {group.meeting_days.join(', ')}
                      {group.meeting_time && ` — ${group.meeting_time.slice(0, 5)}`}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/dashboard/grupos/${group.id}/editar`}
                    className="p-2 rounded-lg text-[#6B6B6B] hover:bg-[#F9F5EE] transition-colors">
                    <Pencil size={15} />
                  </Link>
                  <ConfirmForm
                    action={deleteOwnGroup}
                    confirmMessage={t('deleteConfirm', { name: group.name })}
                    hiddenFields={{ id: group.id }}
                    buttonLabel={t('delete')}
                    buttonClass="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
