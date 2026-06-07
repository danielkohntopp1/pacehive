'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, ExternalLink, Clock, MapPin, Users, Calendar, Zap, Route } from 'lucide-react'
import Link from 'next/link'
import type { Group } from '@/types'

const MODALITY_OPTS = ['Asfalto', 'Trail', 'Pista', 'Montanha']
const LEVEL_OPTS = ['Todos os níveis', 'Iniciante', 'Intermediário', 'Avançado']

function formatTime(time?: string) {
  if (!time) return null
  return time.slice(0, 5)
}

export default function GroupList({ groups, userLoggedIn = false }: { groups: Group[]; userLoggedIn?: boolean }) {
  const [search, setSearch] = useState('')
  const [filterModality, setFilterModality] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterFree, setFilterFree] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return groups.filter(g => {
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        if (!g.city.toLowerCase().includes(q) && !g.name.toLowerCase().includes(q)) return false
      }
      if (filterModality && !(g.modality ?? []).includes(filterModality)) return false
      if (filterLevel && filterLevel !== 'Todos os níveis' && g.level !== filterLevel) return false
      if (filterFree && !g.is_free) return false
      return true
    })
  }, [groups, search, filterModality, filterLevel, filterFree])

  const activeFilters = [filterModality, filterLevel && filterLevel !== 'Todos os níveis' ? filterLevel : '', filterFree ? 'free' : ''].filter(Boolean).length

  return (
    <>
      <div className="space-y-3 mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
          <input type="text" placeholder="Buscar por cidade ou nome do grupo..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 text-sm transition-all shadow-sm" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select value={filterModality} onChange={e => setFilterModality(e.target.value)}
            className="text-sm border border-[#E5E5E5] rounded-xl px-3 py-2 bg-white text-[#6B6B6B] focus:outline-none focus:border-[#F5A623]">
            <option value="">Modalidade</option>
            {MODALITY_OPTS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
            className="text-sm border border-[#E5E5E5] rounded-xl px-3 py-2 bg-white text-[#6B6B6B] focus:outline-none focus:border-[#F5A623]">
            <option value="">Nível</option>
            {LEVEL_OPTS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button type="button" onClick={() => setFilterFree(!filterFree)}
            className={`text-sm px-3 py-2 rounded-xl border transition-colors ${filterFree ? 'bg-[#F5A623] border-[#F5A623] text-black font-semibold' : 'border-[#E5E5E5] bg-white text-[#6B6B6B] hover:border-[#F5A623]'}`}>
            Gratuito
          </button>
          {activeFilters > 0 && (
            <button onClick={() => { setFilterModality(''); setFilterLevel(''); setFilterFree(false) }}
              className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] underline">
              Limpar ({activeFilters})
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-[#E5E5E5] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-[#6B6B6B]" />
          </div>
          <p className="text-[#1A1A1A] font-semibold mb-1">Nenhum grupo encontrado</p>
          <p className="text-[#6B6B6B] text-sm">Tente ajustar os filtros ou buscar por outra cidade.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((group) => (
            <div key={group.id} className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F9F5EE] transition-colors"
                onClick={() => setExpanded(expanded === group.id ? null : group.id)}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-[#1A1A1A]">{group.name}</h3>
                    {group.is_free && <span className="bg-green-100 text-green-700 text-xs font-semibold rounded-full px-2.5 py-0.5">Gratuito</span>}
                    {group.level && group.level !== 'Todos os níveis' && (
                      <span className="bg-[#FEF3DC] text-[#E09510] text-xs font-semibold rounded-full px-2.5 py-0.5">{group.level}</span>
                    )}
                    {(group.modality ?? []).slice(0, 2).map(m => (
                      <span key={m} className="bg-[#F9F5EE] text-[#6B6B6B] text-xs font-medium rounded-full px-2.5 py-0.5">{m}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-[#F5A623]" />
                      {group.city}{group.state ? `, ${group.state}` : ''}
                    </span>
                    {group.meeting_days.length > 0 && (
                      <span className="hidden sm:flex items-center gap-1">
                        <Clock size={13} className="text-[#F5A623]" />
                        {group.meeting_days.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                {expanded === group.id ? <ChevronUp size={18} className="flex-shrink-0 ml-2" /> : <ChevronDown size={18} className="flex-shrink-0 ml-2" />}
              </button>

              {expanded === group.id && (
                <div className="px-5 pb-5 space-y-3 border-t border-[#E5E5E5] pt-4">
                  {group.description && <p className="text-sm text-[#6B6B6B]">{group.description}</p>}
                  {group.meeting_place && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={15} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
                      <div><span className="font-medium text-[#1A1A1A]">Local: </span><span className="text-[#6B6B6B]">{group.meeting_place}</span></div>
                    </div>
                  )}
                  {(group.meeting_days.length > 0 || group.meeting_time) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={15} className="text-[#F5A623]" />
                      <div>
                        <span className="font-medium text-[#1A1A1A]">Horário: </span>
                        <span className="text-[#6B6B6B]">
                          {group.meeting_days.join(', ')}
                          {group.meeting_time && ` — ${formatTime(group.meeting_time)}`}
                        </span>
                      </div>
                    </div>
                  )}
                  {(group.pace_range || group.distance_range) && (
                    <div className="flex flex-wrap gap-4">
                      {group.pace_range && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <Zap size={14} className="text-[#F5A623]" />
                          <span className="text-[#6B6B6B]">{group.pace_range}</span>
                        </div>
                      )}
                      {group.distance_range && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <Route size={14} className="text-[#F5A623]" />
                          <span className="text-[#6B6B6B]">{group.distance_range}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {group.needs_registration && (
                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                      <Calendar size={14} />
                      Precisa de agendamento prévio
                    </div>
                  )}
                  {!group.is_free && group.price_info && (
                    <p className="text-sm text-[#6B6B6B]">
                      <span className="font-medium text-[#1A1A1A]">Valor: </span>{group.price_info}
                    </p>
                  )}
                  {group.how_to_join && (
                    <div className="flex items-start gap-2 text-sm">
                      <Users size={15} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
                      <div><span className="font-medium text-[#1A1A1A]">Como participar: </span><span className="text-[#6B6B6B]">{group.how_to_join}</span></div>
                    </div>
                  )}
                  {group.contact && (
                    <p className="text-sm text-[#6B6B6B]">
                      <span className="font-medium text-[#1A1A1A]">Contato: </span>{group.contact}
                    </p>
                  )}
                  {group.instagram_url && (
                    <a href={group.instagram_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#F5A623] hover:underline font-medium">
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
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Tem um grupo de corrida?</h3>
        <p className="text-[#6B6B6B] text-sm mb-5">
          Cadastre agora e apareça para corredores da sua cidade — sem aprovação necessária.
        </p>
        <Link
          href={userLoggedIn ? '/dashboard/grupos/novo' : '/login?redirect=/dashboard/grupos/novo'}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm">
          Cadastrar meu grupo
        </Link>
      </div>
    </>
  )
}
