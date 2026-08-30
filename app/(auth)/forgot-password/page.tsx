'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Loader2, Mail, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function buildSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    email: z.string().email(t('invalidEmail')),
  })
}
type FormData = z.infer<ReturnType<typeof buildSchema>>

export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPassword')
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const schema = buildSchema(t)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email }: FormData) => {
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    // Always show success (don't leak if email exists)
    setSentEmail(email)
    setSent(true)
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-[#FEF3DC] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail size={24} className="text-[#F5A623]" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">{t('title')}</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          {t('subtitle')}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-8">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="font-bold text-[#1A1A1A]">{t('emailSent')}</p>
              <p className="text-sm text-[#6B6B6B] mt-1">
                {t.rich('ifRegistered', { email: () => <strong>{sentEmail}</strong> })}
              </p>
            </div>
            <p className="text-xs text-[#6B6B6B]">{t('didntReceive')}</p>
            <Link href="/login" className="block text-sm font-semibold text-[#F5A623] hover:underline">
              {t('backToLogin')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? t('sending') : t('sendResetLink')}
            </button>

            <p className="text-center text-sm text-[#6B6B6B]">
              {t('rememberedPassword')}{' '}
              <Link href="/login" className="text-[#F5A623] font-semibold hover:underline">
                {t('signIn')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
