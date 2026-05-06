import { Star } from 'lucide-react'
import type { Review, Profile } from '@/types'

interface Props {
  reviews: (Review & { reviewer?: Profile })[]
}

export default function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return <p className="text-sm text-[#6B6B6B]">Nenhuma avaliação ainda.</p>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-[#E5E5E5] pb-4 last:border-0 last:pb-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-bold text-sm">
                {review.reviewer?.name.charAt(0).toUpperCase() ?? '?'}
              </div>
              <span className="font-semibold text-sm text-[#1A1A1A]">{review.reviewer?.name ?? 'Anônimo'}</span>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < review.rating ? 'text-[#F5A623] fill-[#F5A623]' : 'text-[#E5E5E5] fill-[#E5E5E5]'}
                />
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="text-sm text-[#6B6B6B] leading-relaxed">{review.comment}</p>
          )}
          <p className="text-xs text-[#6B6B6B]/60 mt-1">
            {new Date(review.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      ))}
    </div>
  )
}
