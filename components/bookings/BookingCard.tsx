import Link from 'next/link'
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react'
import type { Booking } from '@/types'
import BookingStatus from './BookingStatus'
import { formatDate } from '@/lib/utils'

interface Props {
  booking: Booking
  variant: 'runner' | 'guide'
}

export default function BookingCard({ booking, variant }: Props) {
  const href = variant === 'runner'
    ? `/dashboard/pedidos/${booking.id}`
    : `/guia/pedidos/${booking.id}`

  const counterpart = variant === 'runner'
    ? booking.guide?.profile?.name ?? 'Guia'
    : booking.runner?.name ?? 'Corredor'

  const counterpartLabel = variant === 'runner' ? 'Guia' : 'Corredor'

  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md hover:border-[#F5A623]/30 transition-all duration-200 p-5">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
            {counterpart.charAt(0).toUpperCase()}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">{counterpart}</p>
                <p className="text-xs text-[#6B6B6B]">{counterpartLabel}</p>
              </div>
              <BookingStatus status={booking.status} size="sm" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-[#6B6B6B]">
              <div className="flex items-center gap-1">
                <Calendar size={11} className="text-[#F5A623] flex-shrink-0" />
                <span className="truncate">{formatDate(booking.run_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-[#F5A623] flex-shrink-0" />
                <span>{booking.run_time.slice(0, 5)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={11} className="text-[#F5A623] flex-shrink-0" />
                <span className="truncate">{booking.city}</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight size={16} className="text-[#6B6B6B] flex-shrink-0 ml-1" />
        </div>
      </div>
    </Link>
  )
}
