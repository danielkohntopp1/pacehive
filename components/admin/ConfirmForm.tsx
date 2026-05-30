'use client'

interface Props {
  action: (fd: FormData) => Promise<void>
  confirmMessage: string
  hiddenFields: Record<string, string>
  buttonLabel: string
  buttonClass: string
}

export default function ConfirmForm({ action, confirmMessage, hiddenFields, buttonLabel, buttonClass }: Props) {
  return (
    <form action={action} onSubmit={(e) => {
      if (!confirm(confirmMessage)) e.preventDefault()
    }}>
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className={buttonClass}>{buttonLabel}</button>
    </form>
  )
}
