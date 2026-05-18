import { createClient } from '@/lib/supabase/server'
import NotificationItem from '@/components/notifications/NotificationItem'
import { Bell } from 'lucide-react'
import type { Notification } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Notificações — PaceHive' }

function groupByDate(notifications: Notification[]) {
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  const groups: { label: string; items: Notification[] }[] = []

  const todayItems = notifications.filter((n) => new Date(n.created_at).toDateString() === today)
  const yestItems = notifications.filter((n) => new Date(n.created_at).toDateString() === yesterday)
  const olderItems = notifications.filter(
    (n) => new Date(n.created_at).toDateString() !== today && new Date(n.created_at).toDateString() !== yesterday
  )

  if (todayItems.length) groups.push({ label: 'Hoje', items: todayItems })
  if (yestItems.length) groups.push({ label: 'Ontem', items: yestItems })
  if (olderItems.length) groups.push({ label: 'Mais antigas', items: olderItems })
  return groups
}

export default async function GuiaNotificacoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const list = (notifications ?? []) as Notification[]
  const groups = groupByDate(list)

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Notificações</h1>
        {list.filter((n) => !n.is_read).length > 0 && (
          <p className="text-sm text-white/50 mt-1">
            {list.filter((n) => !n.is_read).length} não lida{list.filter((n) => !n.is_read).length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {list.length === 0 ? (
        <div className="bg-white/10 rounded-2xl border border-white/10 p-12 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-white/40" />
          </div>
          <p className="font-semibold text-white mb-1">Nenhuma notificação</p>
          <p className="text-sm text-white/50">Você será notificado sobre pedidos e mensagens aqui.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(({ label, items }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">{label}</p>
              <div className="space-y-2">
                {items.map((n) => (
                  <NotificationItem key={n.id} notification={n} bookingBasePath="/guia/pedidos" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
