'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  MapPin, Star, Users, Globe, ExternalLink, Award,
  CheckCircle2, Clock, Languages
} from 'lucide-react'
import type { Guide, Profile, Review } from '@/types'
import BookingForm from '@/components/bookings/BookingForm'

interface Props {
  guide: Guide & { profile: Profile }
  reviews: (Review & { reviewer: Profile })[]
  isLoggedIn: boolean
}

const modalityLabels: Record<string, string> = {
  presential: 'Presencial',
  virtual: 'Virtual',
}

const languageLabels: Record<string, string> = {
  pt: 'Português',
  en: 'Inglês',
  es: 'Espanhol',
  fr: 'Francês',
  de: 'Alemão',
}

const runTypeLabels: Record<string, string> = {
  road: 'Asfalto / Rua',
  trail: 'Trilha',
  track: 'Pista',
  beach: 'Praia / Areia',
  mountain: 'Montanha',
  urban: 'Urbano',
}

const serviceLabels: Record<string, string> = {
  pace_guide: 'Guia de ritmo',
  training_plan: 'Plano de treino',
  race_prep: 'Preparação para prova',
  route_planning: 'Planejamento de rota',
  photography: 'Fotos durante a corrida',
  group_run: 'Corrida em grupo',
}

export default function GuideProfile({ guide, reviews, isLoggedIn }: Props) {
  const [showBookingForm, setShowBookingForm] = useState(false)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden mb-8">
        <div className="md:flex">
          {/* Photo */}
          <div className="md:w-72 flex-shrink-0">
            <div className="relative h-72 md:h-full bg-[#F9F5EE]">
              {guide.profile.avatar_url ? (
                <Image src={guide.profile.avatar_url} alt={guide.profile.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-7xl font-extrabold text-[#F5A623]">
                    {guide.profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-6 md:p-8 flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              {guide.modality.map((m) => (
                <span key={m} className="bg-[#F5A623] text-black text-sm font-semibold rounded-full px-3 py-1">
                  {modalityLabels[m]}
                </span>
              ))}
              {guide.is_paid && guide.price_brl ? (
                <span className="bg-[#0A0A0A] text-white text-sm font-semibold rounded-full px-3 py-1">
                  R$ {guide.price_brl.toFixed(0)}/corrida
                </span>
              ) : (
                <span className="bg-green-100 text-green-700 text-sm font-semibold rounded-full px-3 py-1">
                  Voluntário
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-1">
              {guide.profile.name}
            </h1>

            <div className="flex items-center gap-1.5 text-[#6B6B6B] mb-4">
              <MapPin size={15} className="text-[#F5A623]" />
              <span className="text-sm">{guide.city}, {guide.country}</span>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-5">
              {guide.rating_count > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Star size={16} className="text-[#F5A623] fill-[#F5A623]" />
                  <span className="font-bold text-[#1A1A1A]">{guide.rating_avg.toFixed(1)}</span>
                  <span className="text-[#6B6B6B]">({guide.rating_count} avaliações)</span>
                </div>
              )}
              {guide.total_runs > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                  <Users size={16} />
                  <span>{guide.total_runs} corridas realizadas</span>
                </div>
              )}
              {guide.experience_years && (
                <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                  <Award size={16} />
                  <span>{guide.experience_years} de experiência</span>
                </div>
              )}
            </div>

            {/* Languages */}
            {guide.languages.length > 0 && (
              <div className="flex items-center gap-2 mb-5">
                <Languages size={15} className="text-[#6B6B6B]" />
                <div className="flex flex-wrap gap-1.5">
                  {guide.languages.map((lang) => (
                    <span key={lang} className="text-xs bg-[#F9F5EE] text-[#6B6B6B] font-medium px-2.5 py-0.5 rounded-full">
                      {languageLabels[lang] ?? lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social links */}
            <div className="flex items-center gap-3 mb-6">
              {guide.strava_url && (
                <a href={guide.strava_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
                  <Globe size={14} />
                  Strava
                </a>
              )}
              {guide.instagram_url && (
                <a href={guide.instagram_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
                  <ExternalLink size={14} />
                  Instagram
                </a>
              )}
            </div>

            {/* CTA */}
            {isLoggedIn ? (
              <button
                onClick={() => setShowBookingForm(true)}
                className="px-8 py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
              >
                Solicitar corrida com este guia
              </button>
            ) : (
              <Link
                href={`/login?redirect=/guias/${guide.id}`}
                className="inline-block px-8 py-3.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
              >
                Entrar para solicitar corrida
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Bio */}
        {guide.bio && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">Sobre</h2>
            <p className="text-[#6B6B6B] text-sm leading-relaxed">{guide.bio}</p>
          </div>
        )}

        {/* Run types */}
        {guide.run_types.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">Tipo de corrida</h2>
            <div className="flex flex-wrap gap-2">
              {guide.run_types.map((rt) => (
                <span key={rt} className="text-sm bg-[#F9F5EE] text-[#1A1A1A] font-medium px-3 py-1.5 rounded-full">
                  {runTypeLabels[rt] ?? rt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {guide.services.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-3">Serviços incluídos</h2>
            <ul className="space-y-2">
              {guide.services.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                  <CheckCircle2 size={15} className="text-[#F5A623] flex-shrink-0" />
                  {serviceLabels[s] ?? s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Schedule */}
        {guide.schedule && (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
              <Clock size={18} className="text-[#F5A623]" />
              Disponibilidade
            </h2>
            <p className="text-[#6B6B6B] text-sm leading-relaxed">{guide.schedule}</p>
          </div>
        )}
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-5 flex items-center gap-2">
            <Star size={18} className="text-[#F5A623] fill-[#F5A623]" />
            Avaliações ({reviews.length})
          </h2>
          <div className="space-y-5">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-[#E5E5E5] pb-5 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                      {review.reviewer?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-[#1A1A1A]">{review.reviewer?.name}</span>
                      <p className="text-xs text-[#6B6B6B]/60">
                        {new Date(review.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'text-[#F5A623] fill-[#F5A623]' : 'text-[#E5E5E5] fill-[#E5E5E5]'}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-[#6B6B6B] leading-relaxed pl-11">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          guide={guide}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  )
}
