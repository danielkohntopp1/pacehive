'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BookingStatus from '@/components/bookings/BookingStatus'
import BookingChat from '@/components/bookings/BookingChat'
import CompleteButton from '@/components/bookings/CompleteButton'
import CancelButton from '@/components/bookings/CancelButton'
import ReportModal from '@/components/reports/ReportModal'
import ReviewForm from '@/components/reviews/ReviewForm'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Calendar, CheckCircle, Clock, Flag, MapPin, MessageCircle, User } from 'lucide-react'
import type { Booking } from '@/types'

function TabBar({ active, onChange }: { active: 'details' | 'chat'; onChange: (t: 'details' | 'chat') => void }) {
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
          {tab === 'details' ? 'Detalhes' : 'Chat'}
        </button>
      ))}
    </div>
  )
}

export default function RunnerBookingPage() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [hasReview, setHasReview] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)

      const { data } = await supabase
        .from('bookings')
        .select('*, runner:profiles!runner_id(*), guide:guides(*, profile:profiles(*))')
        .eq('id', id)
        .eq('runner_id', user.id)
        .single()

      if (!data) { setNotFound(true); return }
      setBooking(data as Booking)

      const { data: review } = await supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', id)
        .eq('reviewer_id', user.id)
        .single()
      setHasReview(!!review)
    })
  }, [id])

  if (notFound) return <p className="text-sm text-[#6B6B6B]">Pedido não encontrado.</p>
  if (!booking || !userId) return <p className="text-sm text-[#6B6B6B]">Carregando...</p>

  const b = booking
  const showChat = b.status === 'accepted' || b.status === 'completed'
  const canCancel = b.status === 'pending' || b.status === 'accepted'
  const canReport = b.status !== 'pending' && b.guide?.profile

  return (
    <div className="max-w-2xl">
      {showReport && b.guide?.profile && (
        <ReportModal
          bookingId={b.id}
          reportedId={b.guide_id}
          reportedName={b.guide.profile.name}
          onClose={() => setShowReport(false)}
        />
      )}

      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-6">
        <ArrowLeft size={16} /> Voltar para pedidos
      </Link>

      {showChat && <TabBar active={activeTab} onChange={setActiveTab} />}

      {activeTab === 'chat' && showChat ? (
        <BookingChat
          bookingId={b.id}
          currentUserId={userId}
          otherUserName={b.guide?.profile?.name ?? 'Guia'}
          isReadOnly={b.status === 'completed'}
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-xl font-bold text-[#1A1A1A]">Detalhes do pedido</h1>
                <p className="text-sm text-[#6B6B6B] mt-0.5">#{b.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <BookingStatus status={b.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: User, label: 'Guia', value: b.guide?.profile?.name ?? '-' },
                { icon: Calendar, label: 'Data', value: formatDate(b.run_date) },
                { icon: Clock, label: 'Horário', value: b.run_time.slice(0, 5) },
                { icon: MapPin, label: 'Cidade', value: b.city },
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

            {b.notes && (
              <div className="mt-4 p-3.5 bg-[#F9F5EE] rounded-xl">
                <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wide mb-1.5">Observações</p>
                <p className="text-sm text-[#1A1A1A] leading-relaxed">{b.notes}</p>
              </div>
            )}

            {b.status === 'accepted' && b.guide?.profile && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                  <p className="text-sm font-bold text-green-800">Corrida confirmada!</p>
                </div>
                <p className="text-xs text-green-700/70 font-medium uppercase tracking-wide mb-2">Dados de contato do guia</p>
                <p className="text-sm text-green-800">E-mail: <strong>{b.guide.profile.email}</strong></p>
                {b.guide.profile.phone && (
                  <p className="text-sm text-green-800 mt-1">WhatsApp: <strong>{b.guide.profile.phone}</strong></p>
                )}
              </div>
            )}
          </div>

          {b.status === 'accepted' && (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
              <h2 className="font-bold text-[#1A1A1A] mb-1">Corrida realizada?</h2>
              <p className="text-sm text-[#6B6B6B] mb-4">Registre a conclusão para liberar as avaliações.</p>
              <CompleteButton bookingId={b.id} />
            </div>
          )}

          {canCancel && (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
              <h2 className="font-bold text-[#1A1A1A] mb-1">Cancelar pedido</h2>
              <p className="text-sm text-[#6B6B6B] mb-4">
                {b.status === 'pending' ? 'O guia ainda não respondeu.' : 'A corrida estava confirmada.'}
              </p>
              <CancelButton bookingId={b.id} />
            </div>
          )}

          {b.status === 'completed' && !hasReview && b.guide && (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Avalie sua experiência</h2>
              <p className="text-sm text-[#6B6B6B] mb-4">Como foi correr com {b.guide.profile?.name ?? 'o guia'}?</p>
              <ReviewForm
                bookingId={b.id}
                reviewedId={b.guide_id}
                reviewedName={b.guide.profile?.name ?? 'Guia'}
              />
            </div>
          )}

          {canReport && (
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
              <h2 className="font-bold text-[#1A1A1A] mb-1">Reportar problema</h2>
              <p className="text-sm text-[#6B6B6B] mb-4">Teve algum problema com este guia? Nos informe.</p>
              <button
                onClick={() => setShowReport(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#E5E5E5] text-[#6B6B6B] font-semibold rounded-full hover:border-red-300 hover:text-red-500 transition-colors text-sm"
              >
                <Flag size={16} />
                Denunciar guia
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
