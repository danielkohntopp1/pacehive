import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GroupForm from '@/components/groups/GroupForm'
import { updateOwnGroup } from '../../actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Group } from '@/types'

export default async function EditarGrupoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: group } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .eq('created_by', user.id)
    .single()

  if (!group) redirect('/dashboard/grupos')

  const groupData = group as Group

  async function updateWithId(formData: FormData) {
    'use server'
    formData.set('id', id)
    await updateOwnGroup(formData)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/dashboard/grupos"
          className="inline-flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-4">
          <ChevronLeft size={16} />
          Meus grupos
        </Link>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Editar grupo</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{groupData.name}</p>
      </div>
      <GroupForm
        action={updateWithId}
        initialData={groupData}
        redirectTo="/dashboard/grupos"
        submitLabel="Salvar alterações"
      />
    </div>
  )
}
