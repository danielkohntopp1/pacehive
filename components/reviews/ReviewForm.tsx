'use client'

import { useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  bookingId: string
  reviewedId: string
  reviewedName: string
  onSuccess?: () => void
}

export default function ReviewForm({ bookingId, reviewedId, reviewedName, onSuccess }: Props) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setError('Selecione uma nota'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, reviewed_id: reviewedId, rating, comment }),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Erro ao enviar avaliação')
      }
      onSuccess?.()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-[#6B6B6B]">Avalie sua experiência com <strong>{reviewedName}</strong></p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              size={28}
              className={`transition-colors ${n <= (hover || rating) ? 'text-[#F5A623] fill-[#F5A623]' : 'text-[#E5E5E5] fill-[#E5E5E5]'}`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Conta como foi a corrida (opcional)..."
        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none"
      />

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? 'Enviando...' : 'Enviar avaliação'}
      </button>
    </form>
  )
}
