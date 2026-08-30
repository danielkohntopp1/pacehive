'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { setLocale } from '@/lib/locale/actions'
import type { Locale } from '@/i18n/config'

const options: { value: Locale; label: string }[] = [
  { value: 'pt', label: 'PT-BR' },
  { value: 'en', label: 'EN-US' },
]

interface Props {
  variant?: 'light' | 'dark'
}

export default function LanguageSwitcher({ variant = 'light' }: Props) {
  const locale = useLocale()
  const t = useTranslations('header')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleChange = (next: Locale) => {
    if (next === locale) return
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  const textClass = variant === 'dark' ? 'text-white/70' : 'text-[#6B6B6B]'
  const activeClass = variant === 'dark' ? 'text-white' : 'text-[#1A1A1A]'

  return (
    <div className="flex items-center gap-1.5" aria-label={t('language')}>
      <Globe size={14} className={textClass} />
      {options.map((opt, i) => (
        <span key={opt.value} className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleChange(opt.value)}
            disabled={isPending}
            aria-current={locale === opt.value}
            className={`text-xs font-semibold transition-colors disabled:opacity-50 ${
              locale === opt.value ? activeClass : `${textClass} hover:${activeClass}`
            }`}
          >
            {opt.label}
          </button>
          {i < options.length - 1 && <span className={`text-xs ${textClass}`}>/</span>}
        </span>
      ))}
    </div>
  )
}
