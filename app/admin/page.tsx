import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, Compass, UserX, EyeOff } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createAdminClient()

  const [
    { count: totalGuias },
    { count: guiasAtivos },
    { count: totalCorredores },
    { count: banidos },
  ] = await Promise.all([
    supabase.from('guides').select('*', { count: 'exact', head: true }),
    supabase.from('guides').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_banned', true),
  ])

  const stats = [
    { label: 'Total de guias', value: totalGuias ?? 0, sub: `${guiasAtivos ?? 0} ativos`, icon: Compass, href: '/admin/guias', color: 'text-[#F5A623]', bg: 'bg-[#FEF3DC]' },
    { label: 'Guias inativos', value: (totalGuias ?? 0) - (guiasAtivos ?? 0), sub: 'aguardando ativação', icon: EyeOff, href: '/admin/guias', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total de usuários', value: totalCorredores ?? 0, sub: 'perfis cadastrados', icon: Users, href: '/admin/corredores', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Usuários banidos', value: banidos ?? 0, sub: 'contas suspensas', icon: UserX, href: '/admin/corredores', color: 'text-red-600', bg: 'bg-red-50' },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Painel admin</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Visão geral da plataforma PaceHive</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-2xl border border-[#E5E5E5] p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-extrabold text-[#1A1A1A]">{stat.value}</p>
            <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">{stat.label}</p>
            <p className="text-xs text-[#6B6B6B] mt-0.5">{stat.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/guias" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FEF3DC] rounded-2xl flex items-center justify-center flex-shrink-0">
            <Compass size={22} className="text-[#F5A623]" />
          </div>
          <div>
            <p className="font-bold text-[#1A1A1A]">Gerenciar guias</p>
            <p className="text-sm text-[#6B6B6B]">Ativar, editar, remover perfis de guia</p>
          </div>
          <span className="ml-auto text-[#6B6B6B]">→</span>
        </Link>
        <Link href="/admin/corredores" className="bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Users size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-[#1A1A1A]">Gerenciar corredores</p>
            <p className="text-sm text-[#6B6B6B]">Banir, desbanir ou excluir contas</p>
          </div>
          <span className="ml-auto text-[#6B6B6B]">→</span>
        </Link>
      </div>
    </div>
  )
}
