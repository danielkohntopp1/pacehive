import { Star } from 'lucide-react'
import { getTranslations, getLocale } from 'next-intl/server'
import type { Review, Profile } from '@/types'

interface Props {
  reviews: (Review & { reviewer?: Profile })[]
}

export default async function ReviewList({ reviews }: Props) {
  const t = await getTranslations('reviewList')
  const locale = await getLocale()

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-[#FEF3DC] rounded-xl flex items-center justify-center mx-auto mb-3">
          <Star size={20} className="text-[#F5A623]" />
        </div>
        <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{t('noReviewsYet')}</p>
        <p className="text-xs text-[#6B6B6B]">{t('reviewsWillAppearHere')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-[#E5E5E5] pb-5 last:border-0 last:pb-0">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                {review.reviewer?.name.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div>
                <span className="font-semibold text-sm text-[#1A1A1A]">{review.reviewer?.name ?? t('anonymous')}</span>
                <p className="text-xs text-[#6B6B6B]/60">
                  {new Date(review.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < review.rating ? 'text-[#F5A623] fill-[#F5A623]' : 'text-[#E5E5E5] fill-[#E5E5E5]'}
                />
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="text-sm text-[#6B6B6B] leading-relaxed pl-11">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}
