import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookingStatus from '@/components/bookings/BookingStatus'
import AcceptRefuseButtons from '@/components/bookings/AcceptRefuseButtons'
import CompleteButton from '@/components/bookings/CompleteButton'
import ReviewForm from '@/components/reviews/ReviewForm'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Calendar, CheckCircle, Clock, MapPin, User } from 'lucide-react'
import type { Booking } from '@/types'

interface Props { params: Promise<{ id: string }>; searchParams: Promise<{ action?: string }> }

export default async function GuiaBookingPage({ params, searchParams }: Props) {
  const { id } = await params
  const { action } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, runner:profiles!runner_id(*), guide:guides(*, profile:profiles(*))')
    .eq('id', id)
    .eq('guide_id', user!.id)
    .single()

  if (!booking) notFound()

  const b = booking as Booking

  // Handle accept/refuse via URL action (from email link)
  if (action === 'accept' && b.status === 'pending') {
    await supabase.from('bookings').update({ status: 'accepted' }).eq('id', id)
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/bookings/${id}/accept`, { method: 'POST' }).catch(() => {})
    redirect(`/guia/pedidos/${id}`)
  }
  if (action === 'refuse' && b.status === 'pending') {
    await supabase.from('bookings').update({ status: 'refused' }).eq('id', id)
    redirect(`/guia/pedidos/${id}`)
  }

  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', id)
    .eq('reviewer_id', user!.id)
    .single()

  return (
    <div className="max-w-2xl">
      <Link href="/guia/dashboard" className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-6">
        <ArrowLeft size={16} /> Voltar para pedidos
      </Link>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A]">Pedido de corrida</h1>
            <p className="text-sm text-[#6B6B6B] mt-0.5">#{b.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <BookingStatus status={b.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          {[
            { icon: User, label: 'Corredor', value: b.runner?.name ?? '-' },
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

        {(b.distance_km || b.pace) && (
          <div className="flex gap-3 mb-3">
            {b.distance_km && (
              <div className="bg-[#F9F5EE] rounded-xl px-3.5 py-2.5 text-sm">
                <span className="text-xs text-[#6B6B6B] uppercase tracking-wide font-medium">Distância</span>
                <p className="font-semibold text-[#1A1A1A]">{b.distance_km} km</p>
              </div>
            )}
            {b.pace && (
              <div className="bg-[#F9F5EE] rounded-xl px-3.5 py-2.5 text-sm">
                <span className="text-xs text-[#6B6B6B] uppercase tracking-wide font-medium">Ritmo</span>
                <p className="font-semibold text-[#1A1A1A]">{b.pace} min/km</p>
              </div>
            )}
          </div>
        )}

        {b.notes && (
          <div className="p-3.5 bg-[#F9F5EE] rounded-xl">
            <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wide mb-1.5">Observações do corredor</p>
            <p className="text-sm text-[#1A1A1A] leading-relaxed">{b.notes}</p>
          </div>
        )}

        {b.status === 'accepted' && b.runner && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
              <p className="text-sm font-bold text-green-800">Corrida confirmada!</p>
            </div>
            <p className="text-xs text-green-700/70 font-medium uppercase tracking-wide mb-2">Dados de contato do corredor</p>
            <p className="text-sm text-green-800">E-mail: <strong>{b.runner.email}</strong></p>
            {b.runner.phone && <p className="text-sm text-green-800 mt-1">WhatsApp: <strong>{b.runner.phone}</strong></p>}
          </div>
        )}
      </div>

      {b.status === 'pending' && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
          <h2 className="font-bold text-[#1A1A1A] mb-1">Responder pedido</h2>
          <p className="text-sm text-[#6B6B6B] mb-4">Aceite ou recuse dentro de 24 horas para manter sua reputação.</p>
          <AcceptRefuseButtons bookingId={b.id} />
        </div>
      )}

      {b.status === 'accepted' && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
          <h2 className="font-bold text-[#1A1A1A] mb-1">Corrida realizada?</h2>
          <p className="text-sm text-[#6B6B6B] mb-4">Registre a conclusão para liberar as avaliações.</p>
          <CompleteButton bookingId={b.id} />
        </div>
      )}

      {b.status === 'completed' && !existingReview && b.runner && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Avalie o corredor</h2>
          <p className="text-sm text-[#6B6B6B] mb-4">Como foi correr com {b.runner.name}?</p>
          <ReviewForm
            bookingId={b.id}
            reviewedId={b.runner_id}
            reviewedName={b.runner.name}
          />
        </div>
      )}
    </div>
  )
}
