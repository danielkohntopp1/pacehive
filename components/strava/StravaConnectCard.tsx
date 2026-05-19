'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Unlink } from 'lucide-react'
import { formatPace, formatDistance, formatLastActivity } from '@/lib/strava/client'
import type { StravaStats } from '@/types'

interface Props {
  stravaStats: StravaStats | null
  origin: string
}

export default function StravaConnectCard({ stravaStats, origin }: Props) {
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
          <a
            href={`/api/strava/connect?origin=${encodeURIComponent(origin)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FC4C02] text-white text-sm font-semibold rounded-full hover:bg-[#e04400] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
            Conectar com Strava
          </a>
        </div>
      )}
    </div>
  )
}
