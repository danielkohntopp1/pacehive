'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Bell, CheckCircle, MessageCircle, PlusCircle, Star, XCircle } from 'lucide-react'
import { formatShortDate } from '@/lib/utils'
import type { Notification } from '@/types'

const typeToKey: Record<string, string> = {
  new_booking: 'newBooking',
  booking_accepted: 'bookingAccepted',
  booking_refused: 'bookingRefused',
  booking_cancelled: 'bookingCancelled',
  booking_completed: 'bookingCompleted',
  new_review: 'newReview',
  new_message: 'newMessage',
}

const iconMap: Record<string, { icon: React.ElementType; color: string }> = {
  new_booking:       { icon: PlusCircle,    color: 'text-[#F5A623]' },
  booking_accepted:  { icon: CheckCircle,   color: 'text-green-500' },
  booking_refused:   { icon: XCircle,       color: 'text-red-500' },
  booking_cancelled: { icon: XCircle,       color: 'text-red-500' },
  booking_completed: { icon: CheckCircle,   color: 'text-blue-500' },
  new_message:       { icon: MessageCircle, color: 'text-[#F5A623]' },
  new_review:        { icon: Star,          color: 'text-yellow-500' },
}

interface Props {
  notification: Notification
  bookingBasePath: string
}

export default function NotificationItem({ notification: n, bookingBasePath }: Props) {
  const t = useTranslations('notificationItem')
  const tContent = useTranslations('notificationContent')
  const locale = useLocale() as 'pt' | 'en'
  const [isRead, setIsRead] = useState(n.is_read)

  const contentKey = typeToKey[n.type]
  let title = n.title
  let body = n.body
  if (contentKey && n.data) {
    const values = {
      name: n.data.name ?? '',
      date: n.data.date ? formatShortDate(n.data.date, locale) : '',
      rating: n.data.rating ?? 0,
    }
    title = tContent(`${contentKey}.title`)
    body = tContent(`${contentKey}.body`, values)
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return t('minutesAgo', { count: mins })
    const hours = Math.floor(mins / 60)
    if (hours < 24) return t('hoursAgo', { count: hours })
    const days = Math.floor(hours / 24)
    return t('daysAgo', { count: days })
  }
  const router = useRouter()
  const supabase = createClient()

  async function handleClick() {
    if (!isRead) {
      setIsRead(true)
      await supabase.from('notifications').update({ is_read: true }).eq('id', n.id)
    }
    if (n.booking_id) {
      router.push(`${bookingBasePath}/${n.booking_id}`)
    }
  }

  const { icon: Icon, color } = iconMap[n.type] ?? { icon: Bell, color: 'text-[#6B6B6B]' }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-colors ${
        isRead ? 'bg-white hover:bg-[#F9F5EE]' : 'bg-[#FEF3DC] hover:bg-[#fde9ba]'
      } border border-[#E5E5E5]`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isRead ? 'bg-[#F9F5EE]' : 'bg-white'}`}>
        <Icon size={20} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${isRead ? 'font-medium text-[#1A1A1A]' : 'font-bold text-[#1A1A1A]'}`}>
            {title}
          </p>
          <span className="text-xs text-[#6B6B6B] flex-shrink-0">{timeAgo(n.created_at)}</span>
        </div>
        {body && <p className="text-sm text-[#6B6B6B] mt-0.5 leading-snug">{body}</p>}
      </div>
      {!isRead && (
        <div className="w-2 h-2 rounded-full bg-[#F5A623] flex-shrink-0 mt-1.5" />
      )}
    </button>
  )
}
