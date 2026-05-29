import { createClient } from '@/lib/supabase/server'
import BookingCard from '@/components/bookings/BookingCard'
import Link from 'next/link'
import type { Booking, Guide } from '@/types'

interface ChecklistItem {
  done: boolean
  label: string
  href: string
  hint: string
}

function buildChecklist(guide: Guide, hasAvatar: boolean): ChecklistItem[] {
  return [
    {
      done: hasAvatar,
      label: 'Adicionar foto de perfil',
      href: '/guia/perfil',
      hint: 'Perfis com foto recebem muito mais pedidos',
    },
    {
      done: (guide.run_types?.length ?? 0) > 0,
      label: 'Selecionar tipos de corrida',
      href: '/guia/perfil',
      hint: 'Asfalto, trilha, praia... ajude o runner a te encontrar',
    },
    {
      done: (guide.services?.length ?? 0) > 0,
      label: 'Adicionar serviços oferecidos',
      href: '/guia/perfil',
      hint: 'Guia de ritmo, planejamento de rota, etc.',
    },
    {
      done: !!guide.bio,
      label: 'Escrever uma bio',
      href: '/guia/perfil',
      hint: 'Conte sua história como guia e corredor',
    },
    {
      done: !!guide.strava_stats,
      label: 'Conectar com Strava',
      href: '/guia/perfil',
      hint: 'Exibe dados verificados e aumenta a confiança',
    },
    {
      done: !!(guide.availability?.days?.length || guide.availability?.periods?.length),
      label: 'Configurar disponibilidade',
      href: '/guia/disponibilidade',
      hint: 'Mostra ao runner quando você pode correr',
    },
  ]
}

export default async function GuiaDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [bookingsRes, guideRes, profileRes] = await Promise.all([
    supabase
      .from('bookings')
      .select('*, runner:profiles!runner_id(*), guide:guides(*, profile:profiles(*))')
      .eq('guide_id', user!.id)
      .order('created_at', { ascending: false }),
    supabase.from('guides').select('*').eq('id', user!.id).single(),
    supabase.from('profiles').select('avatar_url').eq('id', user!.id).single(),
  ])

  const bookings = bookingsRes.data ?? []
  const guide = guideRes.data as Guide | null
  const hasAvatar = !!profileRes.data?.avatar_url

  const pending = bookings.filter(b => b.status === 'pending')
  const active = bookings.filter(b => b.status === 'accepted')
  const history = bookings.filter(b => ['completed', 'refused', 'cancelled'].includes(b.status))

  const checklist = guide ? buildChecklist(guide, hasAvatar) : []
  const doneCount = checklist.filter((c) => c.done).length
  const totalCount = checklist.length
  const profileComplete = doneCount === totalCount

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1A1A1A]">Pedidos recebidos</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Responda dentro de 24 horas para manter sua reputação</p>
      </div>

      {/* Onboarding checklist */}
      {!profileComplete && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#1A1A1A]">Complete seu perfil para ser encontrado</h2>
              <p className="text-sm text-[#6B6B6B] mt-0.5">
                {doneCount} de {totalCount} itens concluídos
              </p>
            </div>
            <span className="text-2xl font-extrabold text-[#F5A623]">
              {Math.round((doneCount / totalCount) * 100)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#F9F5EE] rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-[#F5A623] rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / totalCount) * 100}%` }}
            />
          </div>

          <div className="space-y-2">
            {checklist.map((item) => (
              <Link
                key={item.label}
                href={item.done ? '#' : item.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${item.done ? 'opacity-50 cursor-default' : 'hover:bg-[#F9F5EE]'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${item.done ? 'bg-[#F5A623] border-[#F5A623]' : 'border-[#D0D0D0]'}`}>
                  {item.done && <span className="text-black text-xs font-bold">✓</span>}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${item.done ? 'line-through text-[#6B6B6B]' : 'text-[#1A1A1A]'}`}>
                    {item.label}
                  </p>
                  {!item.done && <p className="text-xs text-[#6B6B6B]">{item.hint}</p>}
                </div>
                {!item.done && (
                  <span className="ml-auto text-xs text-[#F5A623] font-semibold flex-shrink-0">Completar →</span>
                )}
              </Link>
            ))}
          </div>

          <p className="text-xs text-[#6B6B6B] mt-4 text-center">
            Seu perfil ficará visível para corredores assim que você ativar a disponibilidade em{' '}
            <Link href="/guia/disponibilidade" className="text-[#F5A623] font-semibold hover:underline">
              Disponibilidade
            </Link>
          </p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3 flex items-center gap-2">
            Aguardando resposta
            <span className="bg-amber-100 text-amber-700 text-xs font-bold rounded-full px-2 py-0.5">{pending.length}</span>
          </h2>
          <div className="space-y-3">
            {pending.map(b => <BookingCard key={b.id} booking={b as Booking} variant="guide" />)}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Confirmados</h2>
          <div className="space-y-3">
            {active.map(b => <BookingCard key={b.id} booking={b as Booking} variant="guide" />)}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider mb-3">Histórico</h2>
          <div className="space-y-3">
            {history.map(b => <BookingCard key={b.id} booking={b as Booking} variant="guide" />)}
          </div>
        </div>
      )}

      {bookings.length === 0 && profileComplete && (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center">
          <div className="w-16 h-16 bg-[#FEF3DC] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Nenhum pedido ainda</h2>
          <p className="text-[#6B6B6B] text-sm">Seu perfil está completo e visível para corredores.</p>
        </div>
      )}
    </div>
  )
}
