'use client'

import type { Message } from '@/app/(app)/messages/types'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  conversationId: number
  onSent: (message: Message) => void
}

// Bottom-of-thread input. Plain controlled textarea + submit button.
// Enter submits (Shift+Enter for newline) — matches typical messaging UX.
//
// Validation duplicates the server contract (non-empty, max 4000) so the
// UI can short-circuit without a round-trip; the server is still the
// source of truth, which is why we surface backend errors via toast.
export default function MessageComposer({ conversationId, onSent }: Props) {
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  async function send() {
    const trimmed = body.trim()
    if (!trimmed || sending) return
    if (trimmed.length > 4000) {
      toast.error('Message too long (max 4000 characters)')
      return
    }

    setSending(true)
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
      // Clear before notifying parent so the next render doesn't briefly
      // show stale text in the composer.
      setBody('')
      onSent(data as Message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  // Enter sends, Shift+Enter inserts a newline. preventDefault on the
  // submitting Enter so the textarea doesn't also insert a line break.
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
        onChange={(e) => setBody(e.target.value)}
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
