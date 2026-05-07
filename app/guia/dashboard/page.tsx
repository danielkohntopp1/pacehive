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
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center">
          <div className="w-16 h-16 bg-[#FEF3DC] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Nenhum pedido ainda</h2>
          <p className="text-[#6B6B6B] text-sm">Complete seu perfil público para ser encontrado por corredores.</p>
        </div>
      )}
    </div>
  )
}
