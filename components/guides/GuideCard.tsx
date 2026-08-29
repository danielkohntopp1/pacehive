import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Users, DollarSign } from 'lucide-react'
import type { Guide, Profile } from '@/types'

interface Props {
  guide: Guide & { profile: Profile }
}

const modalityLabels: Record<string, string> = {
  presential: 'Presencial',
  virtual: 'Virtual',
}

const runTypeLabels: Record<string, string> = {
  road: 'Asfalto',
  trail: 'Trilha',
  track: 'Pista',
  beach: 'Praia',
  mountain: 'Montanha',
  urban: 'Urbano',
}

export default function GuideCard({ guide }: Props) {
  const visibleRunTypes = guide.run_types.slice(0, 3)
  const extraRunTypes = guide.run_types.length - 3

  return (
    <Link href={`/guias/${guide.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
        {/* Photo */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F5EE]">
          {guide.profile.avatar_url ? (
            <Image
              src={guide.profile.avatar_url}
              alt={guide.profile.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl font-extrabold text-[#F5A623]">
                {guide.profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* City overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
            <MapPin size={12} className="text-[#F5A623] flex-shrink-0" />
            <span className="text-white text-xs font-medium truncate">{guide.city}</span>
          </div>

          {/* Strava verified badge top-left */}
          {guide.strava_stats && (
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 bg-[#FC4C02]/90 backdrop-blur-sm text-white text-xs font-bold rounded-full px-2 py-0.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169" /></svg>
                Verificado
              </span>
            </div>
          )}

        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-[#1A1A1A] text-base mb-1.5 truncate">
            {guide.profile.name}
          </h3>

          {/* Bio preview */}
          {guide.bio && (
            <p className="text-xs text-[#6B6B6B] leading-relaxed mb-2 line-clamp-1">{guide.bio}</p>
          )}

          {/* Modality badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {guide.modality.map((m) => (
              <span
                key={m}
                className="bg-[#FEF3DC] text-[#1A1A1A] text-xs font-semibold rounded-full px-2.5 py-0.5"
              >
                {modalityLabels[m] ?? m}
              </span>
            ))}
          </div>

          {/* Run types */}
          {visibleRunTypes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {visibleRunTypes.map((rt) => (
                <span key={rt} className="bg-[#F9F5EE] text-[#6B6B6B] text-xs font-medium rounded-full px-2 py-0.5">
                  {runTypeLabels[rt] ?? rt}
                </span>
              ))}
              {extraRunTypes > 0 && (
                <span className="bg-[#F9F5EE] text-[#6B6B6B] text-xs font-medium rounded-full px-2 py-0.5">
                  +{extraRunTypes}
                </span>
              )}
            </div>
          )}

          {/* Rating & runs */}
          <div className="flex items-center justify-between text-sm text-[#6B6B6B] mb-2.5">
            {guide.rating_count > 0 ? (
              <div className="flex items-center gap-1">
                <Star size={13} className="text-[#F5A623] fill-[#F5A623]" />
                <span className="font-semibold text-[#1A1A1A]">{guide.rating_avg.toFixed(1)}</span>
                <span className="text-xs">({guide.rating_count})</span>
              </div>
            ) : (
              <span className="text-xs text-[#6B6B6B]/60">Novo guia</span>
            )}
            {guide.total_runs > 0 && (
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span className="text-xs">{guide.total_runs} corridas</span>
              </div>
            )}
          </div>

          {/* Price row */}
          <div className="border-t border-[#F9F5EE] pt-2.5 flex items-center gap-1.5">
            <DollarSign size={13} className="text-[#F5A623]" />
            {guide.is_paid && guide.price_brl ? (
              <span className="text-sm font-bold text-[#1A1A1A]">
                R$ {guide.price_brl.toFixed(0)}
                <span className="text-xs font-normal text-[#6B6B6B] ml-1">/ corrida</span>
              </span>
            ) : (
              <span className="text-sm font-bold text-green-600">Gratuito</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
