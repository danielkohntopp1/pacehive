'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import GuideCard from './GuideCard'
import type { Guide, Profile } from '@/types'
import Link from 'next/link'

interface Props {
  guides: (Guide & { profile: Profile })[]
}

export default function GuideList({ guides }: Props) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return guides
    const q = search.trim().toLowerCase()
    return guides.filter(
      (g) =>
        g.city.toLowerCase().includes(q) ||
        g.profile.name.toLowerCase().includes(q) ||
        g.country.toLowerCase().includes(q)
    )
  }, [guides, search])

  return (
    <div>
      {/* Search */}
      <div className="relative max-w-lg mx-auto mb-10">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
        <input
          type="text"
          placeholder="Buscar por cidade ou nome do guia..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 text-sm transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#6B6B6B] text-lg mb-2">Nenhum guia encontrado para &ldquo;{search}&rdquo;</p>
          <p className="text-[#6B6B6B] text-sm mb-6">
            Que tal ser o primeiro guia nessa cidade?
          </p>
          <Link
            href="/seja-um-guia"
            className="inline-block px-6 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors"
          >
            Quero ser guia
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </div>
  )
}
