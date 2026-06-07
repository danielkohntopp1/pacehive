'use server'

import { revalidatePath, refresh } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { parseGroupFormData } from './utils'

export async function createGroup(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const data = parseGroupFormData(formData)
  if (!data.name || !data.city) throw new Error('Nome e cidade são obrigatórios')

  const { error } = await supabase.from('groups').insert({
    ...data,
    is_active: true,
    created_by: user.id,
  })
  if (error) throw new Error(`Erro ao criar grupo: ${error.message}`)
}

export async function updateOwnGroup(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const { data: existing } = await supabase
    .from('groups').select('created_by').eq('id', id).single()
  if (!existing || existing.created_by !== user.id) throw new Error('Não autorizado')

  const data = parseGroupFormData(formData)
  const { error } = await supabase.from('groups').update(data).eq('id', id)
  if (error) throw new Error(`Erro ao atualizar grupo: ${error.message}`)
}

export async function deleteOwnGroup(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autorizado')

  const { data: existing } = await supabase
    .from('groups').select('created_by').eq('id', id).single()
  if (!existing || existing.created_by !== user.id) throw new Error('Não autorizado')

  const { error } = await supabase.from('groups').delete().eq('id', id)
  if (error) throw new Error(`Erro ao excluir grupo: ${error.message}`)
  revalidatePath('/dashboard/grupos')
  refresh()
}
