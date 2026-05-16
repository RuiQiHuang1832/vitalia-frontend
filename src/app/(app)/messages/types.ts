import type { Role } from '@/app/(auth)/stores/auth.store'

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

export type MessagesPage = {
  data: Message[]
  nextCursor: number | null
}
