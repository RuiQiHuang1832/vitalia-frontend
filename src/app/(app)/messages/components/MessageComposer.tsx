'use client'

import type { Message } from '@/app/(app)/messages/types'
import { Button } from '@/components/ui/button'
import { getSocket } from '@/lib/socket'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  conversationId: number
  onSent: (message: Message) => void
}

const TYPING_START_THROTTLE_MS = 2000
const TYPING_STOP_DEBOUNCE_MS = 3000

export default function MessageComposer({ conversationId, onSent }: Props) {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const lastTypingStartRef = useRef(0)
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function emitTypingStop() {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
    if (lastTypingStartRef.current === 0) return
    lastTypingStartRef.current = 0
    getSocket().emit('typing:stop', { conversationId })
  }

  useEffect(() => {
    return () => emitTypingStop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  function handleBodyChange(value: string) {
    setBody(value)

    if (value.trim().length === 0) {
      emitTypingStop()
      return
    }

    const now = Date.now()
    const socket = getSocket()
    // throttle
    if (now - lastTypingStartRef.current >= TYPING_START_THROTTLE_MS) {
      lastTypingStartRef.current = now
      socket.emit('typing:start', { conversationId })
    }
    //debounce
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
    stopTimerRef.current = setTimeout(emitTypingStop, TYPING_STOP_DEBOUNCE_MS)
  }

  async function send() {
    const trimmed = body.trim()
    if (!trimmed || sending) return
    if (trimmed.length > 4000) {
      toast.error('Message too long (max 4000 characters)')
      return
    }

    setSending(true)
    emitTypingStop()
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message ?? 'Failed to send')
      }
      setBody('')
      onSent(data as Message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  return (
    <div className="border-t p-3 flex gap-2 items-end shrink-0">
      <textarea
        value={body}
        onChange={(e) => handleBodyChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message…"
        rows={1}
        className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring max-h-32"
      />
      <Button
        type="button"
        size="icon"
        onClick={send}
        disabled={sending || body.trim().length === 0}
        aria-label="Send message"
      >
        <Send className="size-4" />
      </Button>
    </div>
  )
}
