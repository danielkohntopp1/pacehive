import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookingStatus from '@/components/bookings/BookingStatus'
import ReviewForm from '@/components/reviews/ReviewForm'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin, User } from 'lucide-react'
import type { Booking } from '@/types'

interface Props { params: Promise<{ id: string }> }

export default async function RunnerBookingPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, runner:profiles!runner_id(*), guide:guides(*, profile:profiles(*))')
    .eq('id', id)
    .eq('runner_id', user!.id)
    .single()

  if (!booking) notFound()

  const b = booking as Booking

  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', id)
    .eq('reviewer_id', user!.id)
    .single()

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-6">
        <ArrowLeft size={16} /> Voltar para pedidos
      </Link>

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

      {b.status === 'completed' && !existingReview && b.guide && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Avalie sua experiência</h2>
          <p className="text-sm text-[#6B6B6B] mb-4">Como foi correr com {b.guide.profile?.name ?? 'o guia'}?</p>
          <ReviewForm
            bookingId={b.id}
            reviewedId={b.guide_id}
            reviewedName={b.guide.profile?.name ?? 'Guia'}
          />
        </div>
      )}
    </div>
  )
}
