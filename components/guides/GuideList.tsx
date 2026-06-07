'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import GuideCard from './GuideCard'
import type { Guide, Profile } from '@/types'
import Link from 'next/link'

interface Props {
  guides: (Guide & { profile: Profile })[]
}

const RUN_TYPE_OPTIONS = [
  { value: 'road', label: 'Asfalto' },
  { value: 'trail', label: 'Trilha' },
  { value: 'track', label: 'Pista' },
  { value: 'beach', label: 'Praia' },
  { value: 'mountain', label: 'Montanha' },
  { value: 'urban', label: 'Urbano' },
]

const LANGUAGE_OPTIONS = [
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'Inglês' },
  { value: 'es', label: 'Espanhol' },
  { value: 'fr', label: 'Francês' },
]

type PriceFilter = 'all' | 'free' | 'paid'
type ModalityFilter = 'all' | 'presential' | 'virtual'

interface Filters {
  city: string
  modality: ModalityFilter
  price: PriceFilter
  runTypes: string[]
  languages: string[]
  minRating: number
}

const defaultFilters = (): Filters => ({
  city: '',
  modality: 'all',
  price: 'all',
  runTypes: [],
  languages: [],
  minRating: 0,
})

function countActiveFilters(f: Filters) {
  let n = 0
  if (f.city !== '') n++
  if (f.modality !== 'all') n++
  if (f.price !== 'all') n++
  if (f.runTypes.length > 0) n++
  if (f.languages.length > 0) n++
  if (f.minRating > 0) n++
  return n
}

export default function GuideList({ guides }: Props) {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>(defaultFilters())

  const cities = useMemo(() => {
    const unique = [...new Set(guides.map(g => g.city))].sort()
    return unique
  }, [guides])

  const activeFilterCount = countActiveFilters(filters)

  const toggleRunType = (v: string) => {
    setFilters((f) => ({
      ...f,
      runTypes: f.runTypes.includes(v) ? f.runTypes.filter((x) => x !== v) : [...f.runTypes, v],
    }))
  }

  const toggleLanguage = (v: string) => {
    setFilters((f) => ({
      ...f,
      languages: f.languages.includes(v) ? f.languages.filter((x) => x !== v) : [...f.languages, v],
    }))
  }

  const resetFilters = () => setFilters(defaultFilters())

  const filtered = useMemo(() => {
    return guides.filter((g) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        const matches =
          g.city.toLowerCase().includes(q) ||
          g.profile.name.toLowerCase().includes(q) ||
          g.country.toLowerCase().includes(q)
        if (!matches) return false
      }
      if (filters.city !== '' && g.city !== filters.city) return false
      if (filters.modality !== 'all' && !g.modality.includes(filters.modality)) return false
      if (filters.price === 'free' && g.is_paid) return false
      if (filters.price === 'paid' && !g.is_paid) return false
      if (filters.runTypes.length > 0 && !filters.runTypes.some((rt) => g.run_types.includes(rt))) return false
      if (filters.languages.length > 0 && !filters.languages.some((l) => g.languages.includes(l))) return false
      if (filters.minRating > 0 && (g.rating_count === 0 || g.rating_avg < filters.minRating)) return false
      return true
    })
  }, [guides, search, filters])

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer select-none ${active ? 'bg-[#F5A623] border-[#F5A623] text-black' : 'border-[#E5E5E5] text-[#6B6B6B] hover:border-[#F5A623] bg-white'}`

  return (
    <div>
      {/* Search + filter toggle */}
      <div className="flex gap-3 max-w-2xl mx-auto mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Buscar por cidade ou nome do guia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 text-sm transition-all shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-medium transition-colors shadow-sm ${showFilters || activeFilterCount > 0 ? 'bg-[#F5A623] border-[#F5A623] text-black' : 'bg-white border-[#E5E5E5] text-[#6B6B6B] hover:border-[#F5A623]'}`}
        >
          <SlidersHorizontal size={16} />
          Filtros
          {activeFilterCount > 0 && (
            <span className="bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 mb-6 max-w-2xl mx-auto shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[#1A1A1A]">Filtrar guias</span>
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
                <X size={13} /> Limpar filtros
              </button>
            )}
          </div>

          {/* Cidade */}
          {cities.length > 1 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">Cidade</p>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setFilters((f) => ({ ...f, city: '' }))} className={chipClass(filters.city === '')}>
                  Todas
                </button>
                {cities.map((city) => (
                  <button key={city} onClick={() => setFilters((f) => ({ ...f, city }))} className={chipClass(filters.city === city)}>
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modalidade */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">Modalidade</p>
            <div className="flex gap-2 flex-wrap">
              {([['all', 'Todas'], ['presential', 'Presencial'], ['virtual', 'Virtual']] as [ModalityFilter, string][]).map(([v, l]) => (
                <button key={v} onClick={() => setFilters((f) => ({ ...f, modality: v }))} className={chipClass(filters.modality === v)}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Preço */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">Preço</p>
            <div className="flex gap-2 flex-wrap">
              {([['all', 'Todos'], ['free', 'Gratuito'], ['paid', 'Pago']] as [PriceFilter, string][]).map(([v, l]) => (
                <button key={v} onClick={() => setFilters((f) => ({ ...f, price: v }))} className={chipClass(filters.price === v)}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de corrida */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">Tipo de corrida</p>
            <div className="flex gap-2 flex-wrap">
              {RUN_TYPE_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => toggleRunType(opt.value)} className={chipClass(filters.runTypes.includes(opt.value))}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Idioma */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">Idioma</p>
            <div className="flex gap-2 flex-wrap">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => toggleLanguage(opt.value)} className={chipClass(filters.languages.includes(opt.value))}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nota mínima */}
          <div>
            <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">Nota mínima</p>
            <div className="flex gap-2 flex-wrap">
              {[0, 4, 4.5, 5].map((v) => (
                <button key={v} onClick={() => setFilters((f) => ({ ...f, minRating: v }))} className={chipClass(filters.minRating === v)}>
                  {v === 0 ? 'Qualquer' : `★ ${v}+`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-sm text-[#6B6B6B] text-center mb-8">
          {search.trim() || activeFilterCount > 0
            ? `${filtered.length} guia${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`
            : `${filtered.length} guia${filtered.length !== 1 ? 's' : ''} disponíve${filtered.length !== 1 ? 'is' : 'l'}`}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-[#E5E5E5] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-[#6B6B6B]" />
          </div>
          <p className="text-[#1A1A1A] font-semibold mb-1">Nenhum guia encontrado</p>
          <p className="text-[#6B6B6B] text-sm mb-4">
            {activeFilterCount > 0
              ? 'Tente remover alguns filtros para ver mais resultados.'
              : `Que tal ser o primeiro guia em ${search || 'essa cidade'}?`}
          </p>
          {activeFilterCount > 0 ? (
            <button onClick={resetFilters} className="inline-block px-6 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors">
              Limpar filtros
            </button>
          ) : (
            <Link href="/seja-um-guia" className="inline-block px-6 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors">
              Quero ser guia
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </div>
  )
}
