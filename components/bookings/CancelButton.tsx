'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Loader2, XCircle } from 'lucide-react'

export default function CancelButton({ bookingId }: { bookingId: string }) {
  const t = useTranslations('cancelButton')
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCancel = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      setError(t('errorCancelling'))
      setConfirming(false)
    } finally {
      setLoading(false)
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-red-400 text-red-500 font-semibold rounded-full hover:bg-red-50 transition-colors text-sm"
      >
        <XCircle size={16} />
        {t('cancelBooking')}
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-center text-[#1A1A1A]">
        {t('confirmCancel')}
      </p>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? t('cancelling') : t('yesCancel')}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="flex-1 py-3 border border-[#E5E5E5] text-[#6B6B6B] font-semibold rounded-full hover:bg-[#F9F5EE] transition-colors text-sm"
        >
          {t('back')}
        </button>
      </div>
    </div>
  )
}
