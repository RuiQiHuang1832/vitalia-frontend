'use client'

import ConversationList from '@/app/(app)/messages/components/ConversationList'
import MessageThread from '@/app/(app)/messages/components/MessageThread'
import NewMessageButton from '@/app/(app)/messages/components/NewMessageButton'
import type { Conversation, ConversationsResponse, Message } from '@/app/(app)/messages/types'
import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { useConversations } from '@/hooks/useConversations'
import { useMessageSocket } from '@/hooks/useMessageSocket'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'

type Props = {
  initialData: ConversationsResponse
  // Server-resolved fallback used until the Zustand auth store hydrates,
  // otherwise the conversation list briefly shows the wrong participant.
  initialCurrentUserId: number | null
}

export default function MessagesClient({ initialData, initialCurrentUserId }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Selected conversation lives in the URL so reload / back-forward keep it.
  const selectedIdParam = searchParams.get('c')
  const selectedId = selectedIdParam ? Number(selectedIdParam) : null

  const { data, mutate } = useConversations(initialData)
  const conversations = useMemo(() => data?.data ?? [], [data])
  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId]
  )

  const currentUserId = useAuthStore((s) => s.user?.id)
  const role = useAuthStore((s) => s.user?.role)
  const isProvider = role === 'PROVIDER'

  const { socket } = useMessageSocket()

  useEffect(() => {
    function onMessageNew(message: Message) {
      mutate(
        (current) => {
          if (!current) return current
          const list = current.data
          const idx = list.findIndex((c) => c.id === message.conversationId)

          // New conversation we don't have cached yet — refetch.
          if (idx === -1) {
            return undefined
          }

          const target = list[idx]
          const isFromOther = message.senderId !== currentUserId
          // Don't bump unread for the open thread — the mark-read effect
          // would clear it again moments later, causing a flash.
          const shouldBumpUnread = isFromOther && message.conversationId !== selectedId

          const updated: Conversation = {
            ...target,
            lastMessage: message,
            lastMessageAt: message.createdAt,
            unreadCount: shouldBumpUnread ? target.unreadCount + 1 : target.unreadCount,
          }

          const rest = list.filter((_, i) => i !== idx)
          return { data: [updated, ...rest] }
        },
        { revalidate: false }
      )
    }

    function onMessageRead(payload: {
      conversationId: number
      userId: number
      lastReadAt: string
    }) {
      mutate(
        (current) => {
          if (!current) return current
          const list = current.data
          const idx = list.findIndex((c) => c.id === payload.conversationId)
          if (idx === -1) return current

          const target = list[idx]
          const updatedParticipants = target.participants.map((p) =>
            p.userId === payload.userId ? { ...p, lastReadAt: payload.lastReadAt } : p
          )
          const updated: Conversation = {
            ...target,
            participants: updatedParticipants,
            // Reader is us → clear our other tabs' unread badge.
            unreadCount: payload.userId === currentUserId ? 0 : target.unreadCount,
          }
          const next = [...list]
          next[idx] = updated
          return { data: next }
        },
        { revalidate: false }
      )
    }

    socket.on('message:new', onMessageNew)
    socket.on('message:read', onMessageRead)

    return () => {
      socket.off('message:new', onMessageNew)
      socket.off('message:read', onMessageRead)
    }
  }, [socket, mutate, currentUserId, selectedId])

  useEffect(() => {
    if (!selectedConversation || selectedConversation.unreadCount === 0) return

    const controller = new AbortController()
    fetch(`/api/conversations/${selectedConversation.id}/read`, {
      method: 'POST',
      credentials: 'include',
      signal: controller.signal,
    })
      .then((res) => {
        if (res.ok) mutate()
      })
      .catch(() => {})

    return () => controller.abort()
  }, [selectedConversation, mutate])

  const handleSelect = useCallback(
    (id: number) => {
      // Short-circuit re-selection — router.replace would still fire a
      // route event and refetch the page's RSC payload.
      if (id === selectedId) return
      const params = new URLSearchParams(searchParams.toString())
      params.set('c', String(id))
      router.replace(`/messages?${params.toString()}`, { scroll: false })
    },
    [router, searchParams, selectedId]
  )

  const handleCreated = useCallback(
    (id: number) => {
      mutate()
      handleSelect(id)
    },
    [mutate, handleSelect]
  )

  return (
    <div className="grid grid-cols-[320px_1fr] gap-4 h-[calc(100vh-180px)] mt-5">
      <aside className="border rounded-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b shrink-0">
          <h2 className="text-sm font-semibold pb-0">Conversations</h2>
          {isProvider && <NewMessageButton onCreated={handleCreated} />}
        </div>
        <div className="flex-1 overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={handleSelect}
            initialCurrentUserId={initialCurrentUserId}
          />
        </div>
      </aside>
      <section className="border rounded-xl overflow-hidden flex flex-col">
        <MessageThread conversation={selectedConversation} onMessageSent={mutate} />
      </section>
    </div>
  )
}
