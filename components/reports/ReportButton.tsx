'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Flag } from 'lucide-react'
import ReportModal from './ReportModal'

interface Props {
  bookingId: string
  reportedId: string
  reportedName: string
  label?: string
}

export default function ReportButton({ bookingId, reportedId, reportedName, label }: Props) {
  const t = useTranslations('reportButton')
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {showModal && (
        <ReportModal
          bookingId={bookingId}
          reportedId={reportedId}
          reportedName={reportedName}
          onClose={() => setShowModal(false)}
        />
      )}
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-[#E5E5E5] text-[#6B6B6B] font-semibold rounded-full hover:border-red-300 hover:text-red-500 transition-colors text-sm"
      >
        <Flag size={16} />
        {label ?? t('reportUser')}
      </button>
    </>
  )
}
