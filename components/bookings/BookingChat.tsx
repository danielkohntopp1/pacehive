'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Lock, Send } from 'lucide-react'

interface Message {
  id: string
  booking_id: string
  sender_id: string
  content: string
  created_at: string
}

interface Props {
  bookingId: string
  currentUserId: string
  otherUserName: string
  isReadOnly: boolean
}

export default function BookingChat({ bookingId, currentUserId, otherUserName, isReadOnly }: Props) {
  const t = useTranslations('bookingChat')
  const locale = useLocale()
  const supabase = useMemo(() => createClient(), [])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase
      .from('messages')
      .select('id, booking_id, sender_id, content, created_at')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as Message[])
      })
  }, [bookingId, supabase])

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${bookingId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev
            return [...prev, payload.new as Message]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [bookingId, supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || sending || isReadOnly) return
    setSending(true)
    setInput('')
    await supabase.from('messages').insert({
      booking_id: bookingId,
      sender_id: currentUserId,
      content: text,
    })
    setSending(false)
  }

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString(locale === 'en' ? 'en-US' : 'pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col" style={{ height: '480px' }}>
      <div className="px-5 py-4 border-b border-[#E5E5E5]">
        <h2 className="font-bold text-[#1A1A1A] text-sm">{t('chatWith', { name: otherUserName })}</h2>
        {isReadOnly && (
          <p className="text-xs text-[#6B6B6B] flex items-center gap-1 mt-0.5">
            <Lock size={11} /> {t('runCompletedReadOnly')}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[#6B6B6B] text-center">
              {t('noMessagesYet')}
              {!isReadOnly && <><br />{t('startTheConversation')}</>}
            </p>
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col gap-1 max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                {!isMine && (
                  <span className="text-xs text-[#6B6B6B] font-medium px-1">{otherUserName}</span>
                )}
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine
                    ? 'bg-[#F5A623] text-black rounded-tr-sm'
                    : 'bg-[#F0EDE8] text-[#1A1A1A] rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[11px] text-[#6B6B6B] px-1">{formatTime(msg.created_at)}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {isReadOnly ? (
        <div className="px-5 py-3 border-t border-[#E5E5E5] bg-[#F9F5EE]">
          <p className="text-xs text-[#6B6B6B] text-center flex items-center justify-center gap-1.5">
            <Lock size={12} /> {t('historyPreserved')}
          </p>
        </div>
      ) : (
        <div className="px-4 py-3 border-t border-[#E5E5E5] flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder={t('messagePlaceholder')}
            rows={1}
            className="flex-1 resize-none bg-[#F9F5EE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623]/30 max-h-32 overflow-y-auto"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="p-2.5 bg-[#F5A623] text-black rounded-xl hover:bg-[#E09510] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
