import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import GuideCard from '@/components/guides/GuideCard'
import type { Guide, Profile } from '@/types'

export default async function NovoPedidoPage() {
  const supabase = await createClient()
  const { data: guides } = await supabase
    .from('guides')
    .select('*, profile:profiles(*)')
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Nova solicitação</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          Escolha um guia para solicitar sua corrida
        </p>
      </div>
      <div className="flex items-start gap-3 bg-[#FEF3DC] border border-[#F5A623]/20 rounded-xl p-4 mb-6">
        <span className="text-[#F5A623] text-base leading-none mt-0.5">💡</span>
        <p className="text-sm text-[#1A1A1A]">
          Clique no perfil de um guia para ver detalhes e solicitar uma corrida. Quer ver mais opções?{' '}
          <Link href="/guias" className="text-[#F5A623] font-semibold hover:underline">
            Ver catálogo completo
          </Link>
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(guides ?? []).map(g => (
          <GuideCard key={g.id} guide={g as Guide & { profile: Profile }} />
        ))}
      </div>
    </div>
  )
}
