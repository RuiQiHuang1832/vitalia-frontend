'use client'

import MessageComposer from '@/app/(app)/messages/components/MessageComposer'
import type {
  Conversation,
  ConversationParticipant,
  Message,
  MessagesPage,
} from '@/app/(app)/messages/types'
import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { Button } from '@/components/ui/button'
import { useMessages } from '@/hooks/useMessages'
import { getSocket } from '@/lib/socket'
import { cn } from '@/lib/utils'
import { format, isSameDay, isToday } from 'date-fns'
import { useEffect, useRef } from 'react'

type Props = {
  conversation: Conversation | null
  // Called after a successful send so the parent can refresh the
  // conversation list (last-message preview, ordering, etc).
  onMessageSent: () => void
}

function getOtherParticipant(
  conversation: Conversation,
  currentUserId: number | undefined
): ConversationParticipant {
  const other = conversation.participants.find((p) => p.userId !== currentUserId)
  return other ?? conversation.participants[0]
}

function displayName(p: ConversationParticipant): string {
  if (p.user.patient) return `${p.user.patient.firstName} ${p.user.patient.lastName}`
  if (p.user.provider) return `${p.user.provider.firstName} ${p.user.provider.lastName}`
  return p.user.email
}

export default function MessageThread({ conversation, onMessageSent }: Props) {
  const currentUserId = useAuthStore((s) => s.user?.id)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Hook returns null-key when conversation is null, so SWR doesn't fetch.
  const { messages, hasMore, isLoading, setSize, size, mutate } = useMessages(
    conversation?.id ?? null
  )

  // Auto-scroll to the latest message whenever the message count changes
  // (new send, initial load). Only scrolls within the thread container, not
  // the whole page. Uses a microtask delay so the DOM has the new node
  // before we measure scrollHeight.
  useEffect(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    queueMicrotask(() => {
      el.scrollTop = el.scrollHeight
    })
  }, [messages.length, conversation?.id])

  // Live updates for THIS thread's message list. Listens for any
  // message:new event and only acts on ones for the open conversation.
  // Dedupes against the existing cache by id — important because the
  // sender's own tab already inserted the message via handleSent and
  // would otherwise see it twice.
  const conversationId = conversation?.id ?? null
  useEffect(() => {
    if (conversationId == null) return

    const socket = getSocket()

    function onMessageNew(message: Message) {
      if (message.conversationId !== conversationId) return

      mutate(
        (pages) => {
          if (!pages) return pages
          // Page 0 holds the newest messages — that's where a new arrival
          // belongs. Skip the insert if the id is already present.
          const [first, ...rest] = pages
          if (first?.data.some((m) => m.id === message.id)) {
            return pages
          }
          const updatedFirst: MessagesPage = first
            ? { ...first, data: [message, ...first.data] }
            : { data: [message], nextCursor: null }
          return [updatedFirst, ...rest]
        },
        { revalidate: false }
      )
    }

    socket.on('message:new', onMessageNew)
    return () => {
      socket.off('message:new', onMessageNew)
    }
  }, [conversationId, mutate])

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Select a conversation to start reading.
      </div>
    )
  }

  const other = getOtherParticipant(conversation, currentUserId)

  // Index of the most recent message I sent that the other side has read,
  // or -1 if there isn't one. We only render the read-receipt under that
  // single bubble — replaying it on every prior sent message would be noisy.
  // Recomputed on every render; the conversation cache is mutated when the
  // server emits message:read, which re-renders this component for free.
  //
  // Walks newest → oldest, skipping the other side's messages and any of
  // mine that were sent after their lastReadAt cursor. The first sent-by-me
  // message at-or-before the cursor wins.
  const lastReadByOtherIdx = (() => {
    if (!other.lastReadAt) return -1
    const readAt = new Date(other.lastReadAt).getTime()
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m.senderId !== currentUserId) continue
      if (new Date(m.createdAt).getTime() <= readAt) return i
    }
    return -1
  })()

  // After a successful POST, optimistically prepend the new message to
  // page 0 of the SWR cache so it appears immediately without a refetch.
  // We then call onMessageSent() to refresh the conversation list.
  //
  // Dedupes by id — the server fires the message:new broadcast BEFORE
  // sending the HTTP response, so the websocket frame can land first
  // and the onMessageNew listener may have already inserted this row.
  // Without this guard we'd render the message twice.
  function handleSent(newMessage: Message) {
    mutate(
      (pages) => {
        if (!pages) return pages
        const [first, ...rest] = pages
        if (first?.data.some((m) => m.id === newMessage.id)) {
          return pages
        }
        const updatedFirst = first
          ? { ...first, data: [newMessage, ...first.data] }
          : { data: [newMessage], nextCursor: null }
        return [updatedFirst, ...rest]
      },
      { revalidate: false }
    )
    onMessageSent()
  }

  return (
    <>
      <header className="px-4 py-3 border-b shrink-0">
        <h2 className="font-semibold">{displayName(other)}</h2>
        {other.user.provider?.specialty && (
          <p className="text-xs text-muted-foreground">{other.user.provider.specialty}</p>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {hasMore && (
          <div className="flex justify-center pb-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading}
              onClick={() => setSize(size + 1)}
            >
              {isLoading ? 'Loading…' : 'Load older messages'}
            </Button>
          </div>
        )}

        {messages.map((m, i) => {
          const isMine = m.senderId === currentUserId
          const prev = messages[i - 1]
          // Show a date divider when this message is from a different
          // calendar day than the previous one (or it's the first message).
          const showDateDivider =
            !prev || !isSameDay(new Date(prev.createdAt), new Date(m.createdAt))

          return (
            <div key={m.id}>
              {showDateDivider && (
                <div className="flex justify-center my-3">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {format(new Date(m.createdAt), 'PP')}
                  </span>
                </div>
              )}
              <div
                className={cn(
                  'group flex items-center gap-2',
                  isMine ? 'justify-end' : 'justify-start'
                )}
              >
                {isMine && (
                  <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {format(new Date(m.createdAt), 'p')}
                  </span>
                )}
                <div
                  className={cn(
                    'max-w-[75%] px-3 py-2 rounded-2xl text-sm break-words whitespace-pre-wrap',
                    isMine
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  )}
                >
                  {m.body}
                </div>
                {!isMine && (
                  <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {format(new Date(m.createdAt), 'p')}
                  </span>
                )}
              </div>
              {i === lastReadByOtherIdx && other.lastReadAt && (
                <div className="text-[10px] text-muted-foreground mt-0.5 text-right">
                  Seen{' '}
                  {isToday(new Date(other.lastReadAt))
                    ? `at ${format(new Date(other.lastReadAt), 'p')}`
                    : `on ${format(new Date(other.lastReadAt), 'PP')}`}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <MessageComposer conversationId={conversation.id} onSent={handleSent} />
    </>
  )
}
