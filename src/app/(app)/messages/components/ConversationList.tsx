'use client'

import type {
  Conversation,
  ConversationParticipant,
} from '@/app/(app)/messages/types'
import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'

type Props = {
  conversations: Conversation[]
  selectedId: number | null
  onSelect: (id: number) => void
  // Server-resolved fallback used until the Zustand auth store hydrates,
  // otherwise the first render briefly picks the wrong participant.
  initialCurrentUserId: number | null
}

function getOtherParticipant(
  conversation: Conversation,
  currentUserId: number | undefined
): ConversationParticipant {
  const other = conversation.participants.find(
    (p) => p.userId !== currentUserId
  )
  return other ?? conversation.participants[0]
}

function displayName(p: ConversationParticipant): string {
  if (p.user.patient) return `${p.user.patient.firstName} ${p.user.patient.lastName}`
  if (p.user.provider) return `Dr. ${p.user.provider.firstName} ${p.user.provider.lastName}`
  return p.user.email
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  initialCurrentUserId,
}: Props) {
  const storeUserId = useAuthStore((s) => s.user?.id)
  const currentUserId = storeUserId ?? initialCurrentUserId ?? undefined
  const role = useAuthStore((s) => s.user?.role)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((c) =>
      displayName(getOtherParticipant(c, currentUserId)).toLowerCase().includes(q)
    )
  }, [conversations, search, currentUserId])

  if (conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center text-muted-foreground text-sm">
        {role === 'PATIENT'
          ? 'Your provider will reach out here.'
          : 'No conversations yet.'}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6 text-center text-muted-foreground text-sm">
          No matches.
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto divide-y">
          {filtered.map((c) => {
            const other = getOtherParticipant(c, currentUserId)
            const isSelected = c.id === selectedId
            const preview = c.lastMessage?.body ?? 'No messages yet'

            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors',
                    isSelected && 'bg-muted'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{displayName(other)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-sm text-muted-foreground truncate">
                      {preview}
                    </span>
                    {c.unreadCount > 0 && (
                      <span className="shrink-0 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <div className="p-2 border-t shrink-0">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name…"
          className="h-8 text-sm"
        />
      </div>
    </div>
  )
}
