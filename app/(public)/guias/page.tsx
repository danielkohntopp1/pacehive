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

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A0A0A] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Encontre um guia para correr em{' '}
            <span className="text-[#F5A623]">qualquer lugar do mundo</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Conecte-se com corredores locais que podem te mostrar as melhores rotas.
            Você escolhe o lugar, o guia e o estilo.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <GuideList guides={(guides ?? []) as (Guide & { profile: Profile })[]} />
        </div>
      </section>
    </>
  )
}
