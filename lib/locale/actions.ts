'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { localeCookieName, type Locale } from '@/i18n/config'

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies()
  cookieStore.set(localeCookieName, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('profiles').update({ ui_locale: locale }).eq('id', user.id)
  }
}
