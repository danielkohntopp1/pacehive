import { createClient } from '@/lib/supabase/server'
import BookingCard from '@/components/bookings/BookingCard'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Booking } from '@/types'

export default async function RunnerDashboard() {
  const supabase = await createClient()
  const t = await getTranslations('dashboardHome')
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
          <h1 className="text-2xl font-extrabold text-[#1A1A1A]">{t('title')}</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">{t('subtitle')}</p>
        </div>
        <Link
          href="/dashboard/novo-pedido"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
        >
          <PlusCircle size={16} />
          {t('newRequest')}
        </Link>
      </div>

      {active.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">{t('active')}</h2>
          <div className="space-y-3">
            {active.map(b => <BookingCard key={b.id} booking={b as Booking} variant="runner" />)}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">{t('history')}</h2>
          <div className="space-y-3">
            {history.map(b => <BookingCard key={b.id} booking={b as Booking} variant="runner" />)}
          </div>
        </div>
      )}

      {bookings?.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center">
          <div className="w-16 h-16 bg-[#FEF3DC] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PlusCircle size={28} className="text-[#F5A623]" />
          </div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">{t('noBookingsYet')}</h2>
          <p className="text-[#6B6B6B] text-sm mb-6">{t('findAGuideAndRequest')}</p>
          <Link href="/guias"
            className="inline-block px-6 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm">
            {t('findAGuide')}
          </Link>
        </div>
      )}
    </div>
  )
}
