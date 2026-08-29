import { createClient } from '@/lib/supabase/server'
import GroupList from '@/components/groups/GroupList'
import HiveField from '@/components/brand/HiveField'
import type { Group } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Grupos de Corrida — PaceHive',
  description: 'Encontre grupos de corrida na sua cidade e conecte-se com a comunidade local.',
}

export default async function GruposPage() {
  const supabase = await createClient()

  const [{ data: groups }, { data: { user } }] = await Promise.all([
    supabase.from('groups').select('*').eq('is_active', true).order('city', { ascending: true }),
    supabase.auth.getUser(),
  ])

  const groupList = (groups ?? []) as Group[]

  return (
    <>
      {/* Hero */}
      <section className="relative bg-hive-black text-white py-20 px-4 overflow-hidden">
        <HiveField />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 mb-6">
            <span className="hex-clip w-2.5 h-2.5 bg-[#F5A623] flex-shrink-0" />
            {groupList.length > 0 ? `${groupList.length} grupos cadastrados` : 'Comunidade de corrida'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Encontre um grupo de corrida{' '}
            <span className="text-[#F5A623]">na sua cidade</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Conecte-se com grupos locais e continue correndo mesmo durante viagens.
          </p>
        </div>
      </section>

      {/* List */}
      <section className="bg-[#F9F5EE] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <GroupList groups={groupList} userLoggedIn={!!user} />
        </div>
      </section>
    </>
  )
}
