import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function ContaSuspensaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const t = await getTranslations('accountSuspended')

  const handleSignOut = async () => {
    'use server'
    const { createClient: createServerClient } = await import('@/lib/supabase/server')
    const s = await createServerClient()
    await s.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#F9F5EE] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/">
          <Image
            src="/images/logo/pacehive-vertical-dark.svg"
            alt="PaceHive"
            width={60}
            height={76}
            className="mx-auto mb-8"
          />
        </Link>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-10">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>

          <h1 className="text-xl font-extrabold text-[#1A1A1A] mb-3">{t('title')}</h1>
          <p className="text-sm text-[#6B6B6B] leading-relaxed mb-8">
            {t.rich('description', {
              email: (chunks) => (
                <a href="mailto:contato@pacehive.com" className="text-[#F5A623] font-semibold hover:underline">
                  {chunks}
                </a>
              ),
            })}
          </p>

          <form action={handleSignOut}>
            <button
              type="submit"
              className="w-full py-3 bg-[#1A1A1A] text-white font-semibold rounded-full hover:bg-black transition-colors text-sm"
            >
              {t('signOut')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
