import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RunnerSidebar from '@/components/layout/RunnerSidebar'

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
      <RunnerSidebar profile={profile} signOutAction={handleSignOut} />
      <main className="flex-1 pt-14 lg:pt-0 lg:ml-64 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
