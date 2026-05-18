'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, ExternalLink, Clock, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import type { Group } from '@/types'

function formatTime(time?: string) {
  if (!time) return null
  return time.slice(0, 5)
}

export default function GroupList({ groups }: { groups: Group[] }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return groups
    const q = search.trim().toLowerCase()
    return groups.filter(
      (g) => g.city.toLowerCase().includes(q) || g.name.toLowerCase().includes(q)
    )
  }, [search, groups])

  return (
    <>
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
        <input
          type="text"
          placeholder="Buscar por cidade ou nome do grupo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 text-sm transition-all shadow-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-[#E5E5E5] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-[#6B6B6B]" />
          </div>
          <p className="text-[#1A1A1A] font-semibold mb-1">Nenhum grupo encontrado</p>
          <p className="text-[#6B6B6B] text-sm mb-6">Tente buscar por outra cidade.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((group) => (
            <div key={group.id} className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F9F5EE] transition-colors"
                onClick={() => setExpanded(expanded === group.id ? null : group.id)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#1A1A1A]">{group.name}</h3>
                    {group.is_free && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold rounded-full px-2.5 py-0.5">
                        Gratuito
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#6B6B6B]">
                    <MapPin size={13} className="text-[#F5A623]" />
                    {group.city}{group.state ? `, ${group.state}` : ''}
                  </div>
                </div>
                {expanded === group.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {expanded === group.id && (
                <div className="px-5 pb-5 space-y-3 border-t border-[#E5E5E5] pt-4">
                  {group.meeting_place && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={15} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-[#1A1A1A]">Local: </span>
                        <span className="text-[#6B6B6B]">{group.meeting_place}</span>
                      </div>
                    </div>
                  )}
                  {group.meeting_time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={15} className="text-[#F5A623]" />
                      <div>
                        <span className="font-medium text-[#1A1A1A]">Horário: </span>
                        <span className="text-[#6B6B6B]">
                          {formatTime(group.meeting_time)}
                          {group.meeting_days.length > 0 && ` — ${group.meeting_days.join(', ')}`}
                        </span>
                      </div>
                    </div>
                  )}
                  {group.how_to_join && (
                    <div className="flex items-start gap-2 text-sm">
                      <Users size={15} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-[#1A1A1A]">Como participar: </span>
                        <span className="text-[#6B6B6B]">{group.how_to_join}</span>
                      </div>
                    </div>
                  )}
                  {group.contact && (
                    <p className="text-sm text-[#6B6B6B]">
                      <span className="font-medium text-[#1A1A1A]">Contato: </span>
                      {group.contact}
                    </p>
                  )}
                  {group.instagram_url && (
                    <a
                      href={group.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#F5A623] hover:underline font-medium"
                    >
                      <ExternalLink size={14} />
                      Ver no Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 bg-white rounded-2xl border border-[#E5E5E5] p-8 text-center">
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Conhece um grupo que não está aqui?</h3>
        <p className="text-[#6B6B6B] text-sm mb-5">
          Ajude a comunidade PaceHive crescer indicando grupos de corrida da sua cidade.
        </p>
        <Link
          href="mailto:contato@pacehive.com?subject=Indicação de grupo de corrida"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
        >
          Indicar meu grupo
        </Link>
      </div>
    </>
  )
}
