'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { swrFetcher } from '@/lib/fetcher'
import { cn } from '@/lib/utils'
import { MessageSquarePlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

type Props = {
  onCreated: (conversationId: number) => void
}

type Recipient = {
  userId: number
  firstName: string
  lastName: string
  subtitle?: string
}

type PaginatedResponse<T> = { data: T[] }

type ApiPatient = {
  userId: number | null
  firstName: string
  lastName: string
  email: string
}

const RECIPIENT_PAGE_SIZE = 100

export default function NewMessageButton({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [busyUserId, setBusyUserId] = useState<number | null>(null)

  const swrKey = open ? `/patients?page=1&limit=${RECIPIENT_PAGE_SIZE}` : null
  const { data, isLoading } = useSWR<PaginatedResponse<ApiPatient>>(
    swrKey,
    swrFetcher
  )

  // Patients without a linked User account can't be messaged.
  const recipients = useMemo<Recipient[]>(() => {
    if (!data?.data) return []
    return data.data
      .filter((p) => p.userId != null)
      .map((p) => ({
        userId: p.userId as number,
        firstName: p.firstName,
        lastName: p.lastName,
        subtitle: p.email,
      }))
  }, [data])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return recipients
    return recipients.filter((r) =>
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q)
    )
  }, [recipients, search])

  async function startConversation(recipient: Recipient) {
    if (busyUserId !== null) return
    setBusyUserId(recipient.userId)
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: recipient.userId }),
      })
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result?.message ?? 'Failed to start conversation')
      }
      setOpen(false)
      setSearch('')
      onCreated(result.id)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start conversation')
    } finally {
      setBusyUserId(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline">
          <MessageSquarePlus className="size-4" />
          New
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Start a new conversation</SheetTitle>
          <SheetDescription>Choose a patient to message.</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4 flex flex-col gap-3 flex-1 min-h-0">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            autoFocus
          />

          <ul className="flex-1 overflow-y-auto divide-y border rounded-md">
            {isLoading && (
              <li className="p-4 text-sm text-muted-foreground">Loading…</li>
            )}
            {!isLoading && filtered.length === 0 && (
              <li className="p-4 text-sm text-muted-foreground">
                {recipients.length === 0 ? 'No recipients available.' : 'No matches.'}
              </li>
            )}
            {filtered.map((r) => {
              const busy = busyUserId === r.userId
              return (
                <li key={r.userId}>
                  <button
                    type="button"
                    onClick={() => startConversation(r)}
                    disabled={busyUserId !== null}
                    className={cn(
                      'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors disabled:opacity-50',
                      busy && 'bg-muted'
                    )}
                  >
                    <div className="font-medium">
                      {r.firstName} {r.lastName}
                    </div>
                    {r.subtitle && (
                      <div className="text-xs text-muted-foreground">{r.subtitle}</div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}
