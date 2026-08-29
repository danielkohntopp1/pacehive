import { createClient } from '@/lib/supabase/server'
import GuideList from '@/components/guides/GuideList'
import type { Guide, Profile } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guias de Corrida — PaceHive',
  description: 'Encontre um guia de corrida em qualquer cidade do mundo. Corredores locais que vão te mostrar as melhores rotas.',
}

export default async function GuiasPage() {
  const supabase = await createClient()

  const { data: guides } = await supabase
    .from('guides')
    .select('*, profile:profiles(*)')
    .eq('is_active', true)
    .order('rating_avg', { ascending: false })

  const guideList = (guides ?? []) as (Guide & { profile: Profile })[]

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0A0A0A] text-white py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#F5A623] opacity-10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse flex-shrink-0" />
            {guideList.length > 0 ? `${guideList.length} guias disponíveis` : 'Guias de corrida locais'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Encontre um guia para correr em{' '}
            <span className="text-[#F5A623]">qualquer lugar do mundo</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto">
            Conecte-se com corredores locais que conhecem cada rua, trilha e atalho da cidade.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section className="bg-[#F9F5EE] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <GuideList guides={guideList} />
        </div>
      </section>
    </>
  )
}
