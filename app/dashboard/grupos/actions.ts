'use server'

import { revalidatePath, refresh } from 'next/cache'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { parseGroupFormData } from './utils'
import { localeCookieName, defaultLocale, type Locale } from '@/i18n/config'

async function getActionTranslations() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get(localeCookieName)?.value as Locale) || defaultLocale
  return getTranslations({ locale, namespace: 'groupActions' })
}

export async function createGroup(formData: FormData) {
  const t = await getActionTranslations()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error(t('unauthorized'))

  const data = parseGroupFormData(formData)
  if (!data.name || !data.city) throw new Error(t('nameAndCityRequired'))

  const { error } = await supabase.from('groups').insert({
    ...data,
    is_active: true,
    created_by: user.id,
  })
  if (error) throw new Error(t('errorCreatingGroup', { message: error.message }))
}

export async function updateOwnGroup(formData: FormData) {
  const t = await getActionTranslations()
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error(t('unauthorized'))

  const { data: existing } = await supabase
    .from('groups').select('created_by').eq('id', id).single()
  if (!existing || existing.created_by !== user.id) throw new Error(t('unauthorized'))

  const data = parseGroupFormData(formData)
  const { error } = await supabase.from('groups').update(data).eq('id', id)
  if (error) throw new Error(t('errorUpdatingGroup', { message: error.message }))
}

export async function deleteOwnGroup(formData: FormData) {
  const t = await getActionTranslations()
  const id = formData.get('id') as string
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error(t('unauthorized'))

  const { data: existing } = await supabase
    .from('groups').select('created_by').eq('id', id).single()
  if (!existing || existing.created_by !== user.id) throw new Error(t('unauthorized'))

  const { error } = await supabase.from('groups').delete().eq('id', id)
  if (error) throw new Error(t('errorDeletingGroup', { message: error.message }))
  revalidatePath('/dashboard/grupos')
  refresh()
}
