import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, User, Calendar, Star, LogOut } from 'lucide-react'

export default async function GuiaDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/guia/dashboard')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || (profile.role !== 'guide' && profile.role !== 'both')) {
    redirect('/cadastro/guia')
  }

  const handleSignOut = async () => {
    'use server'
    const { createClient: createServerClient } = await import('@/lib/supabase/server')
    const s = await createServerClient()
    await s.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#F9F5EE] flex">
      <aside className="w-64 bg-[#0A0A0A] flex flex-col fixed inset-y-0">
        <div className="p-5 border-b border-white/10">
          <Link href="/">
            <Image src="/images/logo/pacehive-horizontal-white.svg" alt="PaceHive" width={120} height={32} />
          </Link>
          <p className="text-xs text-white/40 mt-1">Painel do Guia</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/guia/dashboard', icon: LayoutDashboard, label: 'Pedidos recebidos' },
            { href: '/guia/perfil', icon: User, label: 'Meu perfil público' },
            { href: '/guia/disponibilidade', icon: Calendar, label: 'Disponibilidade' },
            { href: '/guia/avaliacoes', icon: Star, label: 'Avaliações' },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              <Icon size={17} className="text-[#F5A623]" />
              {label}
            </Link>
          ))}
          <hr className="border-white/10 my-2" />
          <Link href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <LayoutDashboard size={17} />
            Painel do corredor
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-bold text-sm">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{profile?.name}</p>
              <p className="text-xs text-white/40 truncate">{profile?.email}</p>
            </div>
          </div>
          <form action={handleSignOut}>
            <button type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#EF4444] hover:bg-red-900/20 transition-colors">
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
