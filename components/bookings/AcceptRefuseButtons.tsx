'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

export default function AcceptRefuseButtons({ bookingId }: { bookingId: string }) {
  const t = useTranslations('acceptRefuseButtons')
  const router = useRouter()
  const [loading, setLoading] = useState<'accept' | 'refuse' | null>(null)
  const [result, setResult] = useState<'accepted' | 'refused' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handle = async (action: 'accept' | 'refuse') => {
    setLoading(action)
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/${action === 'accept' ? 'accept' : 'refuse'}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error()
      setResult(action === 'accept' ? 'accepted' : 'refused')
      router.refresh()
    } catch {
      setError(t('errorProcessing'))
    } finally {
      setLoading(null)
    }
  }

  if (result) {
    return (
      <div className={`p-4 rounded-xl text-sm font-semibold text-center ${
        result === 'accepted'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200'
      }`}>
        {result === 'accepted' ? t('acceptedMessage') : t('refusedMessage')}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={() => handle('accept')}
          disabled={!!loading}
          className="flex-1 py-3 bg-[#22C55E] text-white font-semibold rounded-full hover:bg-green-600 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading === 'accept' && <Loader2 size={16} className="animate-spin" />}
          {t('acceptRun')}
        </button>
        <button
          onClick={() => handle('refuse')}
          disabled={!!loading}
          className="flex-1 py-3 border-2 border-[#EF4444] text-[#EF4444] font-semibold rounded-full hover:bg-red-50 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading === 'refuse' && <Loader2 size={16} className="animate-spin" />}
          {t('decline')}
        </button>
      </div>
    </div>
  )
}
