'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import BookingStatus from '@/components/bookings/BookingStatus'
import AcceptRefuseButtons from '@/components/bookings/AcceptRefuseButtons'
import CompleteButton from '@/components/bookings/CompleteButton'
import CancelButton from '@/components/bookings/CancelButton'
import ReportButton from '@/components/reports/ReportButton'
import ReviewForm from '@/components/reviews/ReviewForm'
import BookingChat from '@/components/bookings/BookingChat'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin, MessageCircle, User } from 'lucide-react'
import type { Booking } from '@/types'

interface Props {
  booking: Booking
  userId: string
  hasReview: boolean
}

function TabBar({ active, onChange }: { active: 'details' | 'chat'; onChange: (t: 'details' | 'chat') => void }) {
  const t = useTranslations('bookingDetail')
  return (
    <div className="flex gap-1 mb-4 bg-[#F0EDE8] rounded-xl p-1">
      {(['details', 'chat'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
            active === tab ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
          }`}
        >
          {tab === 'chat' && <MessageCircle size={14} />}
          {tab === 'details' ? t('details') : t('chat')}
        </button>
      ))}
    </div>
  )
}

export default function GuiaBookingContent({ booking: b, userId, hasReview }: Props) {
  const t = useTranslations('guideBookingDetail')
  const locale = useLocale()
  const showChat = b.status === 'accepted' || b.status === 'completed'
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details')

  return (
    <div className="max-w-2xl">
      <Link href="/guia/dashboard" className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-6">
        <ArrowLeft size={16} /> {t('backToBookings')}
      </Link>

      {showChat && <TabBar active={activeTab} onChange={setActiveTab} />}

      {activeTab === 'chat' && showChat ? (
        <BookingChat
          bookingId={b.id}
          currentUserId={userId}
          otherUserName={b.runner?.name ?? t('runner')}
          isReadOnly={b.status === 'completed'}
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-[#1A1A1A]">{t('runRequest')}</h1>
                <p className="text-sm text-[#6B6B6B] mt-0.5">#{b.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <BookingStatus status={b.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[
                { icon: User, label: t('runner'), value: b.runner?.name ?? '-' },
                { icon: Calendar, label: t('date'), value: formatDate(b.run_date, locale as 'pt' | 'en') },
                { icon: Clock, label: t('time'), value: b.run_time.slice(0, 5) },
                { icon: MapPin, label: t('city'), value: b.city },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[#F9F5EE] rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-[#6B6B6B] mb-1">
                    <Icon size={13} className="text-[#F5A623]" />
                    <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
                  </div>
                  <p className="font-semibold text-[#1A1A1A]">{value}</p>
                </div>
              ))}
            </div>

            {(b.distance_km || b.pace) && (
              <div className="flex gap-3 mb-3">
                {b.distance_km && (
                  <div className="bg-[#F9F5EE] rounded-xl px-3.5 py-2.5 text-sm">
                    <span className="text-xs text-[#6B6B6B] uppercase tracking-wide font-medium">{t('distance')}</span>
                    <p className="font-semibold text-[#1A1A1A]">{b.distance_km} km</p>
                  </div>
                )}
                {b.pace && (
                  <div className="bg-[#F9F5EE] rounded-xl px-3.5 py-2.5 text-sm">
                    <span className="text-xs text-[#6B6B6B] uppercase tracking-wide font-medium">{t('pace')}</span>
                    <p className="font-semibold text-[#1A1A1A]">{b.pace} min/km</p>
                  </div>
                )}
              </div>
            )}

            {b.notes && (
              <div className="p-3.5 bg-[#F9F5EE] rounded-xl">
                <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wide mb-1.5">{t('runnerNotes')}</p>
                <p className="text-sm text-[#1A1A1A] leading-relaxed">{b.notes}</p>
              </div>
            )}

            {b.status === 'accepted' && b.runner && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                  <p className="text-sm font-bold text-green-800">{t('runConfirmed')}</p>
                </div>
                <p className="text-xs text-green-700/70 font-medium uppercase tracking-wide mb-2">{t('runnerContactInfo')}</p>
                <p className="text-sm text-green-800">{t('email')}: <strong>{b.runner.email}</strong></p>
                {b.runner.phone && <p className="text-sm text-green-800 mt-1">{t('whatsapp')}: <strong>{b.runner.phone}</strong></p>}
              </div>
            )}
          </div>

          {b.status === 'pending' && (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
              <h2 className="font-bold text-[#1A1A1A] mb-1">{t('respondToRequest')}</h2>
              <p className="text-sm text-[#6B6B6B] mb-4">{t('respondWithin24h')}</p>
              <AcceptRefuseButtons bookingId={b.id} />
            </div>
          )}

          {b.status === 'accepted' && (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
              <h2 className="font-bold text-[#1A1A1A] mb-1">{t('runCompleted')}</h2>
              <p className="text-sm text-[#6B6B6B] mb-4">{t('registerCompletion')}</p>
              <CompleteButton bookingId={b.id} />
            </div>
          )}

          {b.status === 'completed' && !hasReview && b.runner && (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">{t('rateTheRunner')}</h2>
              <p className="text-sm text-[#6B6B6B] mb-4">{t('howWasRunningWith', { name: b.runner.name })}</p>
              <ReviewForm
                bookingId={b.id}
                reviewedId={b.runner_id}
                reviewedName={b.runner.name}
              />
            </div>
          )}

          {b.status === 'accepted' && (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
              <h2 className="font-bold text-[#1A1A1A] mb-1">{t('cancelRun')}</h2>
              <p className="text-sm text-[#6B6B6B] mb-4">{t('cantMakeIt')}</p>
              <CancelButton bookingId={b.id} />
            </div>
          )}

          {(b.status === 'accepted' || b.status === 'completed') && b.runner && (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
              <h2 className="font-bold text-[#1A1A1A] mb-1">{t('reportProblem')}</h2>
              <p className="text-sm text-[#6B6B6B] mb-4">{t('hadProblemWithRunner')}</p>
              <ReportButton
                bookingId={b.id}
                reportedId={b.runner_id}
                reportedName={b.runner.name}
                label={t('reportRunner')}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
