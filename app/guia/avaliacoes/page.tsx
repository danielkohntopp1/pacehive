import { createClient } from '@/lib/supabase/server'
import ReviewList from '@/components/reviews/ReviewList'
import { Star, TrendingUp } from 'lucide-react'
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
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Minhas avaliações</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Reputação construída corrida a corrida</p>
      </div>

      {/* Summary */}
      {guide && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-6">
          <div className="flex items-center gap-8">
            <div className="text-center flex-shrink-0">
              <div className="text-6xl font-extrabold text-[#F5A623] leading-none mb-2">
                {guide.rating_avg.toFixed(1)}
              </div>
              <div className="flex items-center gap-0.5 justify-center mb-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16}
                    className={i < Math.round(guide.rating_avg) ? 'text-[#F5A623] fill-[#F5A623]' : 'text-[#E5E5E5] fill-[#E5E5E5]'} />
                ))}
              </div>
              <p className="text-xs text-[#6B6B6B]">{guide.rating_count} {guide.rating_count === 1 ? 'avaliação' : 'avaliações'}</p>
            </div>

            <div className="flex-1 border-l border-[#E5E5E5] pl-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FEF3DC] rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={18} className="text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-[#1A1A1A] leading-none">{guide.total_runs}</p>
                  <p className="text-sm text-[#6B6B6B] mt-0.5">corridas realizadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-4">Comentários</h2>
        <ReviewList reviews={(reviews ?? []) as (Review & { reviewer: Profile })[]} />
      </div>
    </div>
  )
}
