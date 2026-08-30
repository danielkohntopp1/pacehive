'use client'

import { useTranslations } from 'next-intl'
import type { BookingStatus } from '@/types'

interface Props {
  status: BookingStatus
  size?: 'sm' | 'md'
}

const classNames: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  accepted: 'bg-green-100 text-green-700 border border-green-200',
  refused: 'bg-red-100 text-red-700 border border-red-200',
  completed: 'bg-blue-100 text-blue-700 border border-blue-200',
  cancelled: 'bg-gray-100 text-gray-600 border border-gray-200',
}

export default function BookingStatusBadge({ status, size = 'md' }: Props) {
  const t = useTranslations('bookingStatus')
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${classNames[status]} ${
        size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'
      }`}
    >
      {t(status)}
    </span>
  )
}
