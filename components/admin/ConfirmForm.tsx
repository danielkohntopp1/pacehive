'use client'

import React, { useTransition } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  action: (fd: FormData) => Promise<void>
  confirmMessage: string
  hiddenFields: Record<string, string>
  buttonLabel: string
  buttonClass: string
}

export default function ConfirmForm({ action, confirmMessage, hiddenFields, buttonLabel, buttonClass }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = React.useState<string | null>(null)

  const handleClick = () => {
    if (!window.confirm(confirmMessage)) return
    setError(null)
    startTransition(async () => {
      try {
        const formData = new FormData()
        Object.entries(hiddenFields).forEach(([name, value]) => formData.append(name, value))
        await action(formData)
        window.location.reload()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao executar ação')
      }
    })
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`${buttonClass} disabled:opacity-50 inline-flex items-center gap-1.5`}
      >
        {isPending && <Loader2 size={12} className="animate-spin" />}
        {isPending ? 'Removendo...' : buttonLabel}
      </button>
      {error && <p className="text-xs text-red-600 max-w-[180px] text-right">{error}</p>}
    </div>
  )
}
