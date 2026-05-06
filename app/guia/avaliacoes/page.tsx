import { createClient } from '@/lib/supabase/server'
import ReviewList from '@/components/reviews/ReviewList'
import { Star } from 'lucide-react'
import type { Review, Profile } from '@/types'

export default async function AvaliacoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: guide } = await supabase
    .from('guides')
    .select('rating_avg, rating_count, total_runs')
    .eq('id', user!.id)
    .single()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviewer_id(*)')
    .eq('reviewed_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-[#1A1A1A] mb-6">Minhas avaliações</h1>

      {/* Summary */}
      {guide && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-[#F5A623]">{guide.rating_avg.toFixed(1)}</div>
              <div className="flex items-center gap-0.5 justify-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14}
                    className={i < Math.round(guide.rating_avg) ? 'text-[#F5A623] fill-[#F5A623]' : 'text-[#E5E5E5] fill-[#E5E5E5]'} />
                ))}
              </div>
              <p className="text-xs text-[#6B6B6B] mt-1">{guide.rating_count} avaliações</p>
            </div>
            <div className="border-l border-[#E5E5E5] pl-6">
              <p className="text-2xl font-bold text-[#1A1A1A]">{guide.total_runs}</p>
              <p className="text-sm text-[#6B6B6B]">corridas realizadas</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <ReviewList reviews={(reviews ?? []) as (Review & { reviewer: Profile })[]} />
      </div>
    </div>
  )
}
