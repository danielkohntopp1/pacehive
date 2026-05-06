import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookingStatus from '@/components/bookings/BookingStatus'
import ReviewForm from '@/components/reviews/ReviewForm'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react'
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
      <Link href="/guia/dashboard" className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] mb-6">
        <ArrowLeft size={16} /> Voltar para pedidos
      </Link>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-[#1A1A1A]">Pedido de corrida</h1>
          <BookingStatus status={b.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          {[
            { icon: User, label: 'Corredor', value: b.runner?.name ?? '-' },
            { icon: Calendar, label: 'Data', value: formatDate(b.run_date) },
            { icon: Clock, label: 'Horário', value: b.run_time.slice(0, 5) },
            { icon: MapPin, label: 'Cidade', value: b.city },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#F9F5EE] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[#6B6B6B] mb-0.5">
                <Icon size={13} className="text-[#F5A623]" />
                <span className="text-xs font-medium">{label}</span>
              </div>
              <p className="font-semibold text-[#1A1A1A]">{value}</p>
            </div>
          ))}
        </div>

        {b.distance_km && (
          <p className="text-sm text-[#6B6B6B]">Distância: <strong>{b.distance_km} km</strong></p>
        )}
        {b.pace && (
          <p className="text-sm text-[#6B6B6B]">Ritmo: <strong>{b.pace} min/km</strong></p>
        )}
        {b.notes && (
          <div className="mt-3 p-3 bg-[#F9F5EE] rounded-xl">
            <p className="text-xs font-medium text-[#6B6B6B] mb-1">Observações do corredor</p>
            <p className="text-sm text-[#1A1A1A]">{b.notes}</p>
          </div>
        )}

        {b.status === 'accepted' && b.runner && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm font-semibold text-green-800 mb-2">Corrida confirmada! Dados do corredor:</p>
            <p className="text-sm text-green-700">E-mail: <strong>{b.runner.email}</strong></p>
            {b.runner.phone && <p className="text-sm text-green-700">WhatsApp: <strong>{b.runner.phone}</strong></p>}
          </div>
        )}
      </div>

      {b.status === 'pending' && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
          <h2 className="font-bold text-[#1A1A1A] mb-4">Responder pedido</h2>
          <div className="flex gap-3">
            <form action={`/api/bookings/${id}/accept`} method="POST" className="flex-1">
              <button type="submit"
                className="w-full py-3 bg-[#22C55E] text-white font-semibold rounded-full hover:bg-green-600 transition-colors text-sm">
                ✅ Aceitar corrida
              </button>
            </form>
            <form action={`/api/bookings/${id}/refuse`} method="POST" className="flex-1">
              <button type="submit"
                className="w-full py-3 border-2 border-[#EF4444] text-[#EF4444] font-semibold rounded-full hover:bg-red-50 transition-colors text-sm">
                ❌ Recusar
              </button>
            </form>
          </div>
        </div>
      )}

      {b.status === 'completed' && !existingReview && b.runner && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Avalie o corredor</h2>
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
