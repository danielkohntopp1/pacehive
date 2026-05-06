import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Users } from 'lucide-react'
import type { Guide, Profile } from '@/types'

interface Props {
  guide: Guide & { profile: Profile }
}

export default function GuideCard({ guide }: Props) {
  const modalityLabels: Record<string, string> = {
    presential: 'Presencial',
    virtual: 'Virtual',
  }

  return (
    <Link href={`/guias/${guide.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Photo */}
        <div className="relative aspect-square overflow-hidden bg-[#F9F5EE]">
          {guide.profile.avatar_url ? (
            <Image
              src={guide.profile.avatar_url}
              alt={guide.profile.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-extrabold text-[#F5A623]">
                {guide.profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-[#1A1A1A] text-base mb-1 truncate">
            {guide.profile.name}
          </h3>

          <div className="flex items-center gap-1 text-[#6B6B6B] text-sm mb-3">
            <MapPin size={13} className="text-[#F5A623] flex-shrink-0" />
            <span className="truncate">{guide.city}</span>
          </div>

          {/* Modality badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {guide.modality.map((m) => (
              <span
                key={m}
                className="bg-[#F5A623] text-black text-xs font-semibold rounded-full px-2.5 py-0.5"
              >
                {modalityLabels[m] ?? m}
              </span>
            ))}
            {guide.is_paid && guide.price_brl && (
              <span className="bg-[#0A0A0A] text-white text-xs font-semibold rounded-full px-2.5 py-0.5">
                R$ {guide.price_brl.toFixed(0)}
              </span>
            )}
            {!guide.is_paid && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold rounded-full px-2.5 py-0.5">
                Gratuito
              </span>
            )}
          </div>

          {/* Rating & runs */}
          <div className="flex items-center justify-between text-sm text-[#6B6B6B]">
            {guide.rating_count > 0 ? (
              <div className="flex items-center gap-1">
                <Star size={14} className="text-[#F5A623] fill-[#F5A623]" />
                <span className="font-semibold text-[#1A1A1A]">{guide.rating_avg.toFixed(1)}</span>
                <span>({guide.rating_count})</span>
              </div>
            ) : (
              <span className="text-xs text-[#6B6B6B]">Sem avaliações</span>
            )}
            {guide.total_runs > 0 && (
              <div className="flex items-center gap-1">
                <Users size={13} />
                <span>{guide.total_runs} corridas</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
