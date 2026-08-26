'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Unlink } from 'lucide-react'
import { formatPace, formatDistance, formatLastActivity } from '@/lib/strava/client'
import type { StravaStats } from '@/types'

interface Props {
  stravaStats: StravaStats | null
  origin: string
  limitReached?: boolean
}

export default function StravaConnectCard({ stravaStats, origin, limitReached = false }: Props) {
  const [disconnecting, setDisconnecting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get('strava')

  const handleDisconnect = async () => {
    if (!confirm('Desconectar o Strava? Seus dados serão removidos do perfil.')) return
    setDisconnecting(true)
    await fetch('/api/strava/disconnect', { method: 'POST' })
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 mb-4">
      <div className="flex items-center gap-2.5 mb-4">
        <svg viewBox="0 0 24 24" fill="#FC4C02" className="w-5 h-5">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169" />
        </svg>
        <p className="text-sm font-semibold text-[#1A1A1A]">Strava</p>
        {stravaStats && (
          <span className="ml-auto text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Conectado</span>
        )}
      </div>

      {status === 'connected' && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
          Strava conectado com sucesso! Seus dados já aparecem no seu perfil.
        </div>
      )}
      {status === 'error' && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          Erro ao conectar o Strava. Tente novamente.
        </div>
      )}
      {status === 'denied' && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
          Conexão cancelada.
        </div>
      )}
      {status === 'limit_reached' && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
          Limite temporário de contas do Strava atingido. Tente novamente em breve.
        </div>
      )}

      {stravaStats ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 bg-[#FFF4EE] rounded-xl p-4">
            {stravaStats.ytd_run_distance > 0 && (
              <div>
                <p className="text-xs text-[#6B6B6B] mb-0.5">km rodados</p>
                <p className="font-bold text-[#1A1A1A] text-sm">{formatDistance(stravaStats.ytd_run_distance)}</p>
              </div>
            )}
            {stravaStats.avg_pace && (
              <div>
                <p className="text-xs text-[#6B6B6B] mb-0.5">ritmo médio</p>
                <p className="font-bold text-[#1A1A1A] text-sm">{formatPace(stravaStats.avg_pace)}/km</p>
              </div>
            )}
            {stravaStats.last_activity_at && (
              <div>
                <p className="text-xs text-[#6B6B6B] mb-0.5">última corrida</p>
                <p className="font-bold text-[#1A1A1A] text-sm">{formatLastActivity(stravaStats.last_activity_at)}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="flex items-center gap-1.5 text-sm text-[#EF4444] hover:underline disabled:opacity-50"
          >
            {disconnecting ? <Loader2 size={14} className="animate-spin" /> : <Unlink size={14} />}
            Desconectar Strava
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-[#6B6B6B] mb-4">
            Conecte sua conta do Strava para exibir seus dados reais de corrida no perfil e ganhar o badge de corredor verificado.
          </p>

          {/* Aviso de limite de contas atingido (app aguardando aprovação oficial) */}
          {limitReached && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-amber-800">Integração em processo de aprovação</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  Enquanto aguardamos a aprovação oficial do Strava, o número de contas que podem se conectar é limitado. Esse limite foi atingido — novas conexões serão liberadas assim que a aprovação sair.
                </p>
              </div>
            </div>
          )}

          {limitReached ? (
            <span
              aria-disabled="true"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FC4C02]/40 text-white text-sm font-semibold rounded-full cursor-not-allowed select-none"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              Conectar com Strava
            </span>
          ) : (
            <a
              href={`/api/strava/connect?origin=${encodeURIComponent(origin)}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FC4C02] text-white text-sm font-semibold rounded-full hover:bg-[#e04400] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              Conectar com Strava
            </a>
          )}
        </div>
      )}
    </div>
  )
}
