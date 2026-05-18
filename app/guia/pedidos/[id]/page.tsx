import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GuiaBookingContent from '@/components/bookings/GuiaBookingContent'
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
    <GuiaBookingContent
      booking={b}
      userId={user!.id}
      hasReview={!!existingReview}
    />
  )
}
