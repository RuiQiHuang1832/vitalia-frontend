'use client'

import type {
  Conversation,
  ConversationParticipant,
} from '@/app/(app)/messages/types'
import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { cn } from '@/lib/utils'

type Props = {
  conversations: Conversation[]
  selectedId: number | null
  onSelect: (id: number) => void
  // Server-resolved user id used until the Zustand auth store hydrates.
  // Without this, the first client render has currentUserId=undefined and
  // getOtherParticipant falls back to participants[0], briefly showing
  // wrong names.
  initialCurrentUserId: number | null
}

// Pulls the participant that ISN'T the current user — the "other side" of
// the conversation, used for the display name. Falls back to the first
// participant if for some reason the current user isn't in the list (which
// shouldn't happen since the API only returns conversations they belong to).
function getOtherParticipant(
  conversation: Conversation,
  currentUserId: number | undefined
): ConversationParticipant {
  const other = conversation.participants.find(
    (p) => p.userId !== currentUserId
  )
  return other ?? conversation.participants[0]
}

// Resolves a participant to a human-readable name based on whichever
// profile (patient or provider) is attached. Email is the fallback for the
// rare case where a User exists without a profile row.
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
    <ul className="h-full overflow-y-auto divide-y">
      {conversations.map((c) => {
        const other = getOtherParticipant(c, currentUserId)
        const isSelected = c.id === selectedId
        // Conversations sort by lastMessageAt server-side; we render whatever
        // order the API returned. Preview falls back to a placeholder when
        // the conversation exists but has no messages yet.
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
  )
}
