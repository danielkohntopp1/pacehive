'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Bell, LayoutDashboard, User, Calendar, Star, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id?: string | null
  name?: string | null
  email?: string | null
}

interface Props {
  profile: Profile | null
  signOutAction: () => Promise<void>
  unreadCount?: number
}

const navItems = [
  { href: '/guia/dashboard', icon: LayoutDashboard, label: 'Pedidos recebidos', exact: true },
  { href: '/guia/notificacoes', icon: Bell, label: 'Notificações', exact: false },
  { href: '/guia/perfil', icon: User, label: 'Meu perfil público', exact: false },
  { href: '/guia/disponibilidade', icon: Calendar, label: 'Disponibilidade', exact: false },
  { href: '/guia/avaliacoes', icon: Star, label: 'Avaliações', exact: false },
]

function NavContent({ profile, pathname, signOutAction, onClose, unreadCount }: {
  profile: Profile | null
  pathname: string
  signOutAction: () => Promise<void>
  onClose?: () => void
  unreadCount?: number
}) {
  return (
    <>
      <div className="p-5 border-b border-white/10">
        <Link href="/" onClick={onClose}>
          <Image src="/images/logo/pacehive-horizontal-white.svg" alt="PaceHive" width={120} height={32} />
        </Link>
        <p className="text-xs text-white/40 mt-1">Painel do Guia</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          const isNotif = href === '/guia/notificacoes'
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}>
              <Icon size={17} className={active ? 'text-[#F5A623]' : 'text-[#F5A623]/50'} />
              <span className="flex-1">{label}</span>
              {isNotif && unreadCount && unreadCount > 0 ? (
                <span className="bg-[#F5A623] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </Link>
          )
        })}
        <hr className="border-white/10 my-2" />
        <Link href="/dashboard" onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition-colors">
          <LayoutDashboard size={17} />
          Painel do corredor
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{profile?.name}</p>
            <p className="text-xs text-white/40 truncate">{profile?.email}</p>
          </div>
        </div>
        <form action={signOutAction}>
          <button type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#EF4444] hover:bg-red-900/20 transition-colors">
            <LogOut size={16} />
            Sair
          </button>
        </form>
      </div>
    </>
  )
}

export default function GuiaSidebar({ profile, signOutAction, unreadCount: initialCount }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(initialCount ?? 0)

  useEffect(() => {
    if (!profile?.id) return
    const supabase = createClient()
    const channel = supabase
      .channel(`notif-guia:${profile.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
        (payload) => { if (!payload.new.is_read) setUnreadCount((c) => c + 1) }
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
        (payload) => { if (payload.new.is_read) setUnreadCount((c) => Math.max(0, c - 1)) }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [profile?.id])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0A0A0A] flex-col fixed inset-y-0 z-20">
        <NavContent profile={profile} pathname={pathname} signOutAction={signOutAction} unreadCount={unreadCount} />
      </aside>

      {/* Mobile topbar */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-[#0A0A0A] flex items-center justify-between px-4 z-30">
        <Link href="/">
          <Image src="/images/logo/pacehive-horizontal-white.svg" alt="PaceHive" width={100} height={28} />
        </Link>
        <div className="flex items-center gap-2">
          {unreadCount && unreadCount > 0 ? (
            <Link href="/guia/notificacoes" className="relative p-2 text-white">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F5A623]" />
            </Link>
          ) : null}
          <button onClick={() => setOpen(true)} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-[#0A0A0A] z-50 flex flex-col shadow-xl">
            <div className="flex justify-end p-3">
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white">
                <X size={20} />
              </button>
            </div>
            <NavContent profile={profile} pathname={pathname} signOutAction={signOutAction} onClose={() => setOpen(false)} unreadCount={unreadCount} />
          </aside>
        </>
      )}
    </>
  )
}
