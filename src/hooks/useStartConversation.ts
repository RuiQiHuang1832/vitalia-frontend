'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

// POST /conversations is idempotent — returns existing thread if one exists.
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
