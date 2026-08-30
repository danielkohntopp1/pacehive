'use client'

import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'

interface Props {
  variant: 'runner' | 'guide'
  onAccept: () => void
  onClose: () => void
}

export default function TermsModal({ variant, onAccept, onClose }: Props) {
  const t = useTranslations('termsModal')
  const terms = t.raw(variant === 'runner' ? 'runnerTerms' : 'guideTerms') as { title: string; text: string }[]
  const title = variant === 'runner' ? t('runnerTitle') : t('guideTitle')

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5] flex-shrink-0">
          <h2 className="text-lg font-bold text-[#1A1A1A]">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F9F5EE] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <p className="text-xs text-[#6B6B6B]">{t('lastUpdated')}</p>
          {terms.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1.5">{section.title}</h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E5E5E5] flex-shrink-0">
          <button
            onClick={onAccept}
            className="w-full py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
          >
            {t('acceptTerms')}
          </button>
        </div>
      </div>
    </div>
  )
}
