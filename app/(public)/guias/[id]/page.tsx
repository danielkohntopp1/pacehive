import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GuideProfile from '@/components/guides/GuideProfile'
import type { Guide, Profile, Review } from '@/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('guides')
    .select('*, profile:profiles(name, city)')
    .eq('id', id)
    .single()

  if (!data) return { title: 'Guia não encontrado — PaceHive' }
  return {
    title: `${data.profile?.name} — Guia em ${data.city} | PaceHive`,
    description: data.bio ?? `Corra com ${data.profile?.name} em ${data.city}.`,
  }
}

export default async function GuideProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [guideRes, reviewsRes, userRes] = await Promise.all([
    supabase.from('guides').select('*, profile:profiles(*)').eq('id', id).single(),
    supabase.from('reviews').select('*, reviewer:profiles(*)').eq('reviewed_id', id).order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  if (!guideRes.data) notFound()

  return (
    <section className="py-12 px-4 bg-[#F9F5EE] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <GuideProfile
          guide={guideRes.data as Guide & { profile: Profile }}
          reviews={(reviewsRes.data ?? []) as (Review & { reviewer: Profile })[]}
          isLoggedIn={!!userRes.data.user}
        />
      </div>
    </section>
  )
}
