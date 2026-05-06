import Link from 'next/link'
import { Calendar, Clock, MapPin, User } from 'lucide-react'
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

  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm hover:shadow-md transition-all duration-200 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
              {counterpart.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{counterpart}</p>
              <p className="text-xs text-[#6B6B6B]">{variant === 'runner' ? 'Guia' : 'Corredor'}</p>
            </div>
          </div>
          <BookingStatus status={booking.status} size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-[#6B6B6B]">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-[#F5A623]" />
            <span>{formatDate(booking.run_date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#F5A623]" />
            <span>{booking.run_time.slice(0, 5)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-[#F5A623]" />
            <span>{booking.city}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-[#F5A623]" />
            <span>{booking.modality === 'presential' ? 'Presencial' : 'Virtual'}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
