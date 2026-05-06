import type { BookingStatus } from '@/types'

interface Props {
  status: BookingStatus
  size?: 'sm' | 'md'
}

const config: Record<BookingStatus, { label: string; className: string }> = {
  pending: {
    label: 'Aguardando resposta',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  accepted: {
    label: 'Confirmada ✓',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
  refused: {
    label: 'Recusada',
    className: 'bg-red-100 text-red-700 border border-red-200',
  },
  completed: {
    label: 'Concluída',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  cancelled: {
    label: 'Cancelada',
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
  },
}

export default function BookingStatus({ status, size = 'md' }: Props) {
  const { label, className } = config[status]
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${className} ${
        size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'
      }`}
    >
      {label}
    </span>
  )
}
