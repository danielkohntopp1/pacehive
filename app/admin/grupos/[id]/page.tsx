import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GroupForm from '@/components/groups/GroupForm'
import { adminUpdateGroup } from '../../actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Group } from '@/types'

export default async function AdminEditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createAdminClient()

  const { data: group } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single()

  if (!group) redirect('/admin/grupos')

  const groupData = group as Group

  async function updateWithId(formData: FormData) {
    'use server'
    formData.set('id', id)
    await adminUpdateGroup(formData)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/grupos"
          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors mb-4">
          <ChevronLeft size={16} />
          Grupos
        </Link>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Editar grupo</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{groupData.name}</p>
      </div>
      <GroupForm
        action={updateWithId}
        initialData={groupData}
        redirectTo="/admin/grupos"
        submitLabel="Salvar alterações"
        showIsActive
      />
    </div>
  )
}
