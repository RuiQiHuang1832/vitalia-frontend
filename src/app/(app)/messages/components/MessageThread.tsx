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
import { format, formatDistanceToNow, isSameDay, isToday } from 'date-fns'
import { useEffect, useRef, useState } from 'react'

// Sender re-emits typing:start every 2s while active; clear after 5s of
// silence so a dropped sender doesn't leave the indicator stuck.
const TYPING_INDICATOR_TIMEOUT_MS = 5000

type Props = {
  conversation: Conversation | null
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
  const [typingUserId, setTypingUserId] = useState<number | null>(null)

  // Tick once a minute so "Last seen X ago" stays fresh without a refresh.
  const [, setNowTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setNowTick((n) => n + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const { messages, hasMore, isLoading, setSize, size, mutate } = useMessages(
    conversation?.id ?? null
  )

  useEffect(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    queueMicrotask(() => {
      el.scrollTop = el.scrollHeight
    })
  }, [messages.length, conversation?.id])

  const conversationId = conversation?.id ?? null
  useEffect(() => {
    if (conversationId == null) return

    const socket = getSocket()

    function onMessageNew(message: Message) {
      if (message.conversationId !== conversationId) return

      mutate(
        (pages) => {
          if (!pages) return pages
          const [first, ...rest] = pages
          // Dedupe: server broadcasts BEFORE responding to the sender's POST,
          // so the sender's own tab can race the websocket frame.
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

  useEffect(() => {
    setTypingUserId(null)
    if (conversationId == null) return

    const socket = getSocket()
    let safetyTimer: ReturnType<typeof setTimeout> | null = null

    function clearSafety() {
      if (safetyTimer) {
        clearTimeout(safetyTimer)
        safetyTimer = null
      }
    }

    // Filter own userId — our other tabs are in the same room and would
    // otherwise show us as typing to ourselves.
    function onTypingStart(payload: { conversationId: number; userId: number }) {
      if (payload.conversationId !== conversationId) return
      if (payload.userId === currentUserId) return
      setTypingUserId(payload.userId)
      clearSafety()
      safetyTimer = setTimeout(() => setTypingUserId(null), TYPING_INDICATOR_TIMEOUT_MS)
    }

    function onTypingStop(payload: { conversationId: number; userId: number }) {
      if (payload.conversationId !== conversationId) return
      if (payload.userId === currentUserId) return
      setTypingUserId(null)
      clearSafety()
    }

    socket.on('typing:start', onTypingStart)
    socket.on('typing:stop', onTypingStop)
    return () => {
      socket.off('typing:start', onTypingStart)
      socket.off('typing:stop', onTypingStop)
      clearSafety()
    }
  }, [conversationId, currentUserId])

  // Complement to the parent's select-time mark-read: a message arriving in
  // the open thread doesn't bump unreadCount (we suppress that to avoid a
  // flash), so we still need to advance lastReadAt server-side.
  const lastMarkedReadIdRef = useRef<number | null>(null)
  useEffect(() => {
    if (conversationId == null) return
    const latest = messages[messages.length - 1]
    if (!latest || latest.conversationId !== conversationId) return
    if (latest.senderId === currentUserId) return
    if (latest.id === lastMarkedReadIdRef.current) return

    lastMarkedReadIdRef.current = latest.id

    const controller = new AbortController()
    fetch(`/api/conversations/${conversationId}/read`, {
      method: 'POST',
      credentials: 'include',
      signal: controller.signal,
    }).catch(() => {})

    return () => controller.abort()
  }, [conversationId, messages, currentUserId])

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Select a conversation to start reading.
      </div>
    )
  }

  const other = getOtherParticipant(conversation, currentUserId)

  // Index of the most recent message I sent that the other side has read.
  // Render the receipt only under that bubble, not every prior one.
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {other.user.provider?.specialty && (
            <span>{other.user.provider.specialty}</span>
          )}
          {other.user.provider?.specialty && other.lastReadAt && <span>·</span>}
          {other.lastReadAt && (
            <span>
              Last seen{' '}
              {formatDistanceToNow(new Date(other.lastReadAt), { addSuffix: true })}
            </span>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-3 pb-10 space-y-2">
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

      {typingUserId !== null && typingUserId === other.userId && (
        <div className="px-4 pt-2 pb-1 text-xs text-muted-foreground italic shrink-0">
          {displayName(other)} is typing…
        </div>
      )}

      <MessageComposer conversationId={conversation.id} onSent={handleSent} />
    </>
  )
}
