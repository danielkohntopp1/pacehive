'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function CompleteButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleComplete = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/complete`, { method: 'POST' })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      setError('Erro ao registrar conclusão. Tente novamente.')
      setConfirming(false)
    } finally {
      setLoading(false)
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#22C55E] text-[#22C55E] font-semibold rounded-full hover:bg-green-50 transition-colors text-sm"
      >
        <CheckCircle size={16} />
        Marcar corrida como concluída
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-center text-[#1A1A1A]">
        Confirma que a corrida foi realizada? Ambos receberão um pedido de avaliação por e-mail.
      </p>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={handleComplete}
          disabled={loading}
          className="flex-1 py-3 bg-[#22C55E] text-white font-semibold rounded-full hover:bg-green-600 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Registrando...' : 'Sim, concluída'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="flex-1 py-3 border border-[#E5E5E5] text-[#6B6B6B] font-semibold rounded-full hover:bg-[#F9F5EE] transition-colors text-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
