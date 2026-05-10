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
  // Current user's id resolved server-side from the JWT cookie. Used as a
  // fallback for the conversation list's "other participant" derivation
  // until the Zustand auth store finishes hydrating — prevents the
  // wrong-name flash on first paint.
  initialCurrentUserId: number | null
}

// Top-level client component for the /messages page. Renders the split
// pane (conversation list + active thread) and owns:
//   - the SWR cache for conversations (so child components share one source)
//   - the "which conversation is selected" state, persisted in the URL as
//     ?c=<id> so reloading the page keeps the selection (and matches the
//     project preference of inline edits over /[id] routes)
//   - the side effect of marking a conversation read when it's opened
export default function MessagesClient({ initialData, initialCurrentUserId }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Selected conversation ID lives in the URL. Reading it here makes the
  // selection survive reload, browser back/forward, and shareable links.
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

  // Connect the socket while this page is mounted. Lifecycle hook handles
  // auth gating + connect/disconnect on unmount; we just need the socket
  // reference to attach our listeners below.
  const { socket } = useMessageSocket()

  // Live updates for the conversations list (left pane). Two events:
  //   - message:new → update lastMessage / lastMessageAt / unreadCount
  //   - message:read → reflect the other side reading our messages
  // Listeners are attached once when the socket reference is stable.
  // Listeners ALSO run for events the current user originated, so we
  // dedupe / no-op for self-events to avoid double-counting.
  useEffect(() => {
    //     Direct mutation approach
    // Socket event arrives with the new message in the payload.
    // Handler transforms the cache directly using that payload.
    // UI re-renders.
    function onMessageNew(message: Message) {
      mutate(
        (current) => {
          if (!current) return current
          const list = current.data
          const idx = list.findIndex((c) => c.id === message.conversationId)

          // Conversation isn't in our local cache (e.g. the other party
          // started it and we haven't refetched yet) — fall back to a full
          // refetch by returning undefined. SWR re-fetches on undefined.
          if (idx === -1) {
            return undefined
          }

          const target = list[idx]
          const isFromOther = message.senderId !== currentUserId
          // Only bump unread when the message is from the other side AND
          // the conversation isn't the one currently open. The mark-read
          // effect would clear it again moments later otherwise — a UI flash.
          const shouldBumpUnread = isFromOther && message.conversationId !== selectedId

          const updated: Conversation = {
            ...target,
            lastMessage: message,
            lastMessageAt: message.createdAt,
            unreadCount: shouldBumpUnread ? target.unreadCount + 1 : target.unreadCount,
          }

          // Remove the old entry and re-insert in correct order. Backend
          // sorts by lastMessageAt DESC, so the just-updated row goes first.
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
          // If the reader is us, our other tabs should clear their unread
          // badge. (The tab that triggered the read already cleared via the
          // POST /read response.)
          const updated: Conversation = {
            ...target,
            participants: updatedParticipants,
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

  // Mark the conversation as read whenever the selection changes to a
  // conversation that has unread messages. Fire-and-forget — if it fails
  // we'll try again next time. After success we mutate() so the list
  // re-fetches and the unread badge clears.
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
      .catch(() => {
        // Aborted on unmount — ignore.
      })

    return () => controller.abort()
  }, [selectedConversation, mutate])

  // Select-by-id, persisted in the URL. Wrapped in useCallback so the
  // NewMessageButton's onCreated dependency stays stable.
  //
  // Short-circuit when the user clicks the already-selected conversation
  // — without this, router.replace fires a no-op navigation that Next
  // still treats as a route event and refetches the page's RSC payload.
  const handleSelect = useCallback(
    (id: number) => {
      if (id === selectedId) return
      const params = new URLSearchParams(searchParams.toString())
      params.set('c', String(id))
      router.replace(`/messages?${params.toString()}`, { scroll: false })
    },
    [router, searchParams, selectedId]
  )

  // After NewMessageButton creates (or finds) a conversation we want two
  // things in order: refresh the list so the new thread shows up, then
  // select it so the right pane jumps straight to it.
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
