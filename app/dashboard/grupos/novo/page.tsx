import GroupForm from '@/components/groups/GroupForm'
import { createGroup } from '../actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export default async function NovoGrupoPage() {
  const t = await getTranslations('groupNew')
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/dashboard/grupos"
          className="inline-flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-4">
          <ChevronLeft size={16} />
          {t('myGroups')}
        </Link>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">{t('title')}</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          {t('subtitle')}
        </p>
      </div>
      <GroupForm action={createGroup} redirectTo="/dashboard/grupos" submitLabel={t('submitLabel')} />
    </div>
  )
}
