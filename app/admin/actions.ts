'use server'

import { revalidatePath, refresh } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'
import { parseGroupFormData } from '@/app/dashboard/grupos/utils'

export async function toggleGuideActive(formData: FormData) {
  const id = formData.get('id') as string
  const isActive = formData.get('isActive') === 'true'
  const supabase = await createAdminClient()
  await supabase.from('guides').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/admin/guias')
  refresh()
}

export async function updateGuide(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createAdminClient()

  const isPaid = formData.get('is_paid') === 'true'
  const priceBrl = formData.get('price_brl')

  await supabase.from('guides').update({
    city: formData.get('city') as string,
    country: formData.get('country') as string,
    bio: formData.get('bio') as string || null,
    experience_years: formData.get('experience_years') as string || null,
    is_paid: isPaid,
    price_brl: isPaid && priceBrl ? parseFloat(priceBrl as string) : null,
    is_active: formData.get('is_active') === 'true',
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  revalidatePath('/admin/guias')
  revalidatePath(`/admin/guias/${id}`)
  refresh()
}

export async function removeGuideProfile(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createAdminClient()
  // Cancel active bookings before removing
  await supabase.from('bookings')
    .update({ status: 'cancelled' })
    .eq('guide_id', id)
    .in('status', ['pending', 'accepted'])
  // Delete guide record — guide_id in historical bookings is SET NULL via FK (ON DELETE SET NULL)
  const { error } = await supabase.from('guides').delete().eq('id', id)
  if (error) throw new Error(`Erro ao remover guia: ${error.message}`)
  // Downgrade role to runner
  await supabase.from('profiles').update({ role: 'runner' }).eq('id', id)
  revalidatePath('/admin/guias')
  refresh()
}

export async function toggleBanUser(formData: FormData) {
  const id = formData.get('id') as string
  const isBanned = formData.get('isBanned') === 'true'
  const supabase = await createAdminClient()
  await supabase.from('profiles').update({ is_banned: isBanned }).eq('id', id)
  revalidatePath('/admin/corredores')
  refresh()
}

export async function deleteUser(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createAdminClient()
  // All FK constraints now use ON DELETE SET NULL or CASCADE — no pre-deletion needed
  const { error } = await supabase.auth.admin.deleteUser(id)
  if (error) throw new Error(`Erro ao excluir usuário: ${error.message}`)
  revalidatePath('/admin/corredores')
  revalidatePath('/admin/guias')
  refresh()
}

export async function adminUpdateGroup(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createAdminClient()
  const data = parseGroupFormData(formData)
  const isActive = formData.get('is_active') === 'true'
  const { error } = await supabase.from('groups').update({ ...data, is_active: isActive }).eq('id', id)
  if (error) throw new Error(`Erro ao atualizar grupo: ${error.message}`)
  revalidatePath('/admin/grupos')
  refresh()
}

export async function adminDeleteGroup(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createAdminClient()
  const { error } = await supabase.from('groups').delete().eq('id', id)
  if (error) throw new Error(`Erro ao excluir grupo: ${error.message}`)
  revalidatePath('/admin/grupos')
  refresh()
}
