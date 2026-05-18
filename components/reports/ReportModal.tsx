'use client'

import { useState } from 'react'
import { Loader2, X } from 'lucide-react'

interface Props {
  bookingId: string
  reportedId: string
  reportedName: string
  onClose: () => void
}

const REASONS = [
  { value: 'comportamento_inadequado', label: 'Comportamento inadequado' },
  { value: 'no_show', label: 'Não compareceu (no-show)' },
  { value: 'fraude', label: 'Fraude ou informações falsas' },
  { value: 'outro', label: 'Outro' },
]

export default function ReportModal({ bookingId, reportedId, reportedName, onClose }: Props) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) return
    if (reason === 'outro' && !description.trim()) {
      setError('Descreva o problema quando selecionar "Outro".')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, reported_id: reportedId, reason, description }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      setError('Erro ao enviar denúncia. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E5E5]">
          <h2 className="text-lg font-bold text-[#1A1A1A]">Denunciar usuário</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F9F5EE] transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <p className="font-bold text-[#1A1A1A] mb-2">Denúncia enviada</p>
              <p className="text-sm text-[#6B6B6B] mb-6">
                Recebemos seu relato sobre <strong>{reportedName}</strong> e vamos analisá-lo em breve.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#F5A623] text-black font-semibold rounded-full hover:bg-[#E09510] transition-colors text-sm"
              >
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-[#6B6B6B]">
                Você está denunciando <strong className="text-[#1A1A1A]">{reportedName}</strong>. Selecione o motivo:
              </p>

              <div className="space-y-2">
                {REASONS.map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E5E5E5] cursor-pointer hover:border-[#F5A623] transition-colors has-[:checked]:border-[#F5A623] has-[:checked]:bg-[#FFF8ED]">
                    <input
                      type="radio"
                      name="reason"
                      value={value}
                      checked={reason === value}
                      onChange={() => setReason(value)}
                      className="accent-[#F5A623]"
                    />
                    <span className="text-sm font-medium text-[#1A1A1A]">{label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Descrição {reason === 'outro' ? <span className="text-red-500">*</span> : <span className="text-[#6B6B6B] font-normal">(opcional)</span>}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que aconteceu..."
                  rows={3}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20 transition-all resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading || !reason}
                  className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Enviando...' : 'Enviar denúncia'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-[#E5E5E5] text-[#6B6B6B] font-semibold rounded-full hover:bg-[#F9F5EE] transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
