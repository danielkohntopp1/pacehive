'use client'

import { useState, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

function buildSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(6, t('minChars')),
  })
}

type FormData = z.infer<ReturnType<typeof buildSchema>>

export default function LoginPage() {
  const t = useTranslations('common')
  return (
    <Suspense fallback={<div className="w-full max-w-md text-center text-[#6B6B6B] text-sm">{t('loading')}</div>}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const t = useTranslations('login')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const schema = buildSchema(t)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (authError) {
      setError(t('wrongCredentials'))
      return
    }
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Image
          src="/images/logo/pacehive-vertical-dark.svg"
          alt="PaceHive"
          width={80}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">{t('welcomeBack')}</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{t('signInToYourAccount')}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('email')}</label>
            <input
              type="email"
              {...register('email')}
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('password')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#1A1A1A]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? t('signingIn') : t('signIn')}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link href="/forgot-password" className="block text-sm text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
            {t('forgotPassword')}
          </Link>
          <p className="text-sm text-[#6B6B6B]">
            {t('noAccount')}{' '}
            <Link
              href={redirect === '/cadastro/guia' ? '/cadastro?guide=true' : '/cadastro'}
              className="text-[#F5A623] font-semibold hover:underline"
            >
              {redirect === '/cadastro/guia' ? t('signUpAsGuide') : t('signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
