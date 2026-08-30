import { createClient } from '@/lib/supabase/server'
import NotificationItem from '@/components/notifications/NotificationItem'
import { Bell } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Notification } from '@/types'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('notificationsPage')
  return { title: t('metaTitle') }
}

export default async function NotificacoesPage() {
  const supabase = await createClient()
  const t = await getTranslations('notificationsPage')
  const { data: { user } } = await supabase.auth.getUser()

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const list = (notifications ?? []) as Notification[]

  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  const todayItems = list.filter((n) => new Date(n.created_at).toDateString() === today)
  const yestItems = list.filter((n) => new Date(n.created_at).toDateString() === yesterday)
  const olderItems = list.filter(
    (n) => new Date(n.created_at).toDateString() !== today && new Date(n.created_at).toDateString() !== yesterday
  )
  const groups = [
    { label: t('today'), items: todayItems },
    { label: t('yesterday'), items: yestItems },
    { label: t('older'), items: olderItems },
  ].filter((g) => g.items.length > 0)

  const unreadCount = list.filter((n) => !n.is_read).length

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">{t('title')}</h1>
        {unreadCount > 0 && (
          <p className="text-sm text-[#6B6B6B] mt-1">
            {t('unreadCount', { count: unreadCount })}
          </p>
        )}
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center">
          <div className="w-16 h-16 bg-[#F9F5EE] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-[#6B6B6B]" />
          </div>
          <p className="font-semibold text-[#1A1A1A] mb-1">{t('noNotifications')}</p>
          <p className="text-sm text-[#6B6B6B]">{t('youWillBeNotifiedHere')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(({ label, items }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-3">{label}</p>
              <div className="space-y-2">
                {items.map((n) => (
                  <NotificationItem key={n.id} notification={n} bookingBasePath="/dashboard/pedidos" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
