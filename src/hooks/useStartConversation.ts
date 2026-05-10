'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

// POSTs to /conversations (idempotent — backend returns the existing thread
// if one already exists for this participant pair) and navigates to
// /messages?c=<id>. Returns a `busy` flag so callers can disable the trigger
// while the request is in flight.
//
// Error handling: surfaces backend message via toast. Caller doesn't need
// to handle exceptions — they're swallowed inside the hook.
export function useStartConversation() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function startConversation(participantUserId: number) {
    if (busy) return
    setBusy(true)
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: participantUserId }),
      })
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result?.message ?? 'Failed to start conversation')
      }
      router.push(`/messages?c=${result.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start conversation')
    } finally {
      setBusy(false)
    }
  }

  return { startConversation, busy }
}
