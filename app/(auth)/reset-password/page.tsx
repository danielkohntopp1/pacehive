'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Loader2, Eye, EyeOff, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function buildSchema(t: ReturnType<typeof useTranslations>) {
  return z.object({
    password: z.string().min(6, t('minChars')),
    confirm: z.string(),
  }).refine(d => d.password === d.confirm, {
    message: t('passwordsDontMatch'),
    path: ['confirm'],
  })
}
type FormData = z.infer<ReturnType<typeof buildSchema>>

export default function ResetPasswordPage() {
  const t = useTranslations('resetPassword')
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const schema = buildSchema(t)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ password }: FormData) => {
    setError(null)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(t('resetFailed'))
      return
    }
    router.push('/dashboard?reset=true')
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-[#FEF3DC] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock size={24} className="text-[#F5A623]" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">{t('title')}</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('newPassword')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder={t('minCharsPlaceholder')}
                className="w-full px-4 py-3 pr-11 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#1A1A1A]">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{t('confirmPassword')}</label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('confirm')}
              placeholder={t('confirmPasswordPlaceholder')}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all"
            />
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? t('saving') : t('saveNewPassword')}
          </button>
        </form>
      </div>
    </div>
  )
}
