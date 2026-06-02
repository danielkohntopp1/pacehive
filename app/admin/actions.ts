'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/server'

export async function toggleGuideActive(formData: FormData) {
  const id = formData.get('id') as string
  const isActive = formData.get('isActive') === 'true'
  const supabase = await createAdminClient()
  await supabase.from('guides').update({ is_active: isActive }).eq('id', id)
  revalidatePath('/admin/guias')
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
}

export async function removeGuideProfile(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createAdminClient()
  // Cancel active bookings (pending and accepted) before removing
  await supabase.from('bookings')
    .update({ status: 'cancelled' })
    .eq('guide_id', id)
    .in('status', ['pending', 'accepted'])
  // Delete guide record — guide_id in historical bookings will be SET NULL via FK cascade
  const { error } = await supabase.from('guides').delete().eq('id', id)
  if (error) throw new Error(`Erro ao remover guia: ${error.message}`)
  // Downgrade role to runner
  await supabase.from('profiles').update({ role: 'runner' }).eq('id', id)
  revalidatePath('/admin/guias')
}

export async function toggleBanUser(formData: FormData) {
  const id = formData.get('id') as string
  const isBanned = formData.get('isBanned') === 'true'
  const supabase = await createAdminClient()
  await supabase.from('profiles').update({ is_banned: isBanned }).eq('id', id)
  revalidatePath('/admin/corredores')
}

export async function deleteUser(formData: FormData) {
  const id = formData.get('id') as string
  const supabase = await createAdminClient()
  // Cancel pending bookings
  await supabase.from('bookings')
    .update({ status: 'cancelled' })
    .or(`runner_id.eq.${id},guide_id.eq.${id}`)
    .eq('status', 'pending')
  // Delete auth user — cascades to profiles and guides
  await supabase.auth.admin.deleteUser(id)
  revalidatePath('/admin/corredores')
  revalidatePath('/admin/guias')
}
