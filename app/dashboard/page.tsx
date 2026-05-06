import { createClient } from '@/lib/supabase/server'
import BookingCard from '@/components/bookings/BookingCard'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import type { Booking } from '@/types'

export default async function RunnerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, guide:guides(*, profile:profiles(*))')
    .eq('runner_id', user!.id)
    .order('created_at', { ascending: false })

  const active = bookings?.filter(b => ['pending', 'accepted'].includes(b.status)) ?? []
  const history = bookings?.filter(b => ['completed', 'refused', 'cancelled'].includes(b.status)) ?? []

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Meus pedidos</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Acompanhe suas solicitações de corrida</p>
        </div>
        <Link
          href="/dashboard/novo-pedido"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
        >
          <PlusCircle size={16} />
          Nova solicitação
        </Link>
      </div>

      {active.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Ativos</h2>
          <div className="space-y-3">
            {active.map(b => <BookingCard key={b.id} booking={b as Booking} variant="runner" />)}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Histórico</h2>
          <div className="space-y-3">
            {history.map(b => <BookingCard key={b.id} booking={b as Booking} variant="runner" />)}
          </div>
        </div>
      )}

      {bookings?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#6B6B6B] text-lg mb-2">Você ainda não tem pedidos</p>
          <p className="text-[#6B6B6B] text-sm mb-6">Encontre um guia e solicite sua primeira corrida!</p>
          <Link href="/guias"
            className="inline-block px-6 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm">
            Encontrar um guia
          </Link>
        </div>
      )}
    </div>
  )
}
