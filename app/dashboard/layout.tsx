import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, User, PlusCircle, LogOut } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/dashboard')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const handleSignOut = async () => {
    'use server'
    const { createClient: createServerClient } = await import('@/lib/supabase/server')
    const s = await createServerClient()
    await s.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#F9F5EE] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col fixed inset-y-0">
        <div className="p-5 border-b border-[#E5E5E5]">
          <Link href="/">
            <Image src="/images/logo/pacehive-horizontal-dark.svg" alt="PaceHive" width={120} height={32} />
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F9F5EE] transition-colors">
            <LayoutDashboard size={17} className="text-[#F5A623]" />
            Meus pedidos
          </Link>
          <Link href="/dashboard/novo-pedido"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F9F5EE] transition-colors">
            <PlusCircle size={17} className="text-[#F5A623]" />
            Nova solicitação
          </Link>
          <Link href="/dashboard/perfil"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F9F5EE] transition-colors">
            <User size={17} className="text-[#F5A623]" />
            Meu perfil
          </Link>
          {(profile?.role === 'guide' || profile?.role === 'both') && (
            <Link href="/guia/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F9F5EE] transition-colors">
              <LayoutDashboard size={17} className="text-[#F5A623]" />
              Painel do guia
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-[#E5E5E5]">
          <div className="flex items-center gap-2.5 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-black font-bold text-sm">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">{profile?.name}</p>
              <p className="text-xs text-[#6B6B6B] truncate">{profile?.email}</p>
            </div>
          </div>
          <form action={handleSignOut}>
            <button type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#EF4444] hover:bg-red-50 transition-colors">
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
