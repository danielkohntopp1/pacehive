import { createClient } from '@/lib/supabase/server'
import BookingCard from '@/components/bookings/BookingCard'
import type { Booking } from '@/types'

export default async function GuiaDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, runner:profiles!runner_id(*), guide:guides(*, profile:profiles(*))')
    .eq('guide_id', user!.id)
    .order('created_at', { ascending: false })

  const pending = bookings?.filter(b => b.status === 'pending') ?? []
  const active = bookings?.filter(b => b.status === 'accepted') ?? []
  const history = bookings?.filter(b => ['completed', 'refused', 'cancelled'].includes(b.status)) ?? []

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Pedidos recebidos</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Responda dentro de 24 horas para manter sua reputação</p>
      </div>

      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3 flex items-center gap-2">
            Aguardando resposta
            <span className="bg-amber-100 text-amber-700 text-xs font-bold rounded-full px-2 py-0.5">{pending.length}</span>
          </h2>
          <div className="space-y-3">
            {pending.map(b => <BookingCard key={b.id} booking={b as Booking} variant="guide" />)}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Confirmados</h2>
          <div className="space-y-3">
            {active.map(b => <BookingCard key={b.id} booking={b as Booking} variant="guide" />)}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Histórico</h2>
          <div className="space-y-3">
            {history.map(b => <BookingCard key={b.id} booking={b as Booking} variant="guide" />)}
          </div>
        </div>
      )}

      {bookings?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E5E5]">
          <p className="text-[#6B6B6B] text-lg mb-2">Nenhum pedido ainda</p>
          <p className="text-[#6B6B6B] text-sm">Complete seu perfil público para ser encontrado por corredores.</p>
        </div>
      )}
    </div>
  )
}
