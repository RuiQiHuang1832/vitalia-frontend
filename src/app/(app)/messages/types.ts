// Types mirroring the shapes returned by the backend conversation endpoints.
// Keeping these co-located with the messages feature per the project
// convention of per-feature types.ts files.

import type { Role } from '@/app/(auth)/stores/auth.store'

// Each participant row carries the joined User + Patient/Provider profile
// so the UI can render a display name without a second round-trip.
// patient/provider are mutually exclusive — exactly one is non-null per row,
// determined by the user's role.
export type ConversationParticipant = {
  conversationId: number
  userId: number
  lastReadAt: string | null
  user: {
    id: number
    email: string
    role: Role
    patient: { id: number; firstName: string; lastName: string } | null
    provider: {
      id: number
      firstName: string
      lastName: string
      specialty: string
    } | null
  }
}

export type Message = {
  id: number
  conversationId: number
  senderId: number
  body: string
  createdAt: string
}

// Conversation as returned by GET /conversations. lastMessage is null when
// the conversation has been created but no messages have been sent yet.
export type Conversation = {
  id: number
  createdAt: string
  lastMessageAt: string
  participants: ConversationParticipant[]
  lastMessage: Message | null
  unreadCount: number
}

export type ConversationsResponse = {
  data: Conversation[]
}

// Cursor-paginated message page. nextCursor is null when there are no older
// messages left — the hook stops fetching further pages when it sees this.
export type MessagesPage = {
  data: Message[]
  nextCursor: number | null
}
