import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, Compass, LogOut } from 'lucide-react'

const ADMIN_EMAIL = 'danielkohntopp@gmail.com'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/guias', label: 'Guias', icon: Compass, exact: false },
  { href: '/admin/corredores', label: 'Corredores', icon: Users, exact: false },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/dashboard')

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
      <aside className="hidden lg:flex w-60 bg-[#0A0A0A] flex-col fixed inset-y-0 z-20">
        <div className="p-5 border-b border-white/10">
          <Link href="/">
            <Image src="/images/logo/pacehive-horizontal-white.svg" alt="PaceHive" width={110} height={30} />
          </Link>
          <p className="text-xs text-[#F5A623] font-bold mt-1 uppercase tracking-widest">Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Icon size={17} className="text-[#F5A623]/70" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Voltar ao app
          </Link>
          <form action={handleSignOut}>
            <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#EF4444] hover:bg-red-900/20 transition-colors">
              <LogOut size={15} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 lg:ml-60 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
