import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GuiaSidebar from '@/components/layout/GuiaSidebar'

export default async function GuiaDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/guia/dashboard')

  const [{ data: profile }, { count: unreadCount }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false),
  ])
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
      <GuiaSidebar profile={profile} signOutAction={handleSignOut} unreadCount={unreadCount ?? 0} />
      <main className="flex-1 pt-14 lg:pt-0 lg:ml-64 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
