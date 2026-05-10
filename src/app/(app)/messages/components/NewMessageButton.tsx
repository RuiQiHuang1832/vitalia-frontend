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
  // Called after the sheet successfully creates (or finds) a conversation,
  // so the parent can select it and mutate the conversations list.
  onCreated: (conversationId: number) => void
}

// Minimal recipient — just enough fields to render the row and resolve
// the userId for the POST. userId is nullable on Patient in the schema,
// so we filter out anyone who has no linked User account before rendering
// (those can't be messaged).
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

// Pull a large-ish first page so the in-memory search covers most cases.
// If user base outgrows this, swap to a server-side ?name= filter.
const RECIPIENT_PAGE_SIZE = 100

// Provider-only: patients can't initiate conversations. Parent component
// gates rendering on role === 'PROVIDER', so this component assumes the
// caller is a provider and always fetches patients.
export default function NewMessageButton({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [busyUserId, setBusyUserId] = useState<number | null>(null)

  // Only fetch when the sheet is open — avoids loading a list the user
  // never asked to see. The conditional key is the SWR pattern for this.
  const swrKey = open ? `/patients?page=1&limit=${RECIPIENT_PAGE_SIZE}` : null
  const { data, isLoading } = useSWR<PaginatedResponse<ApiPatient>>(
    swrKey,
    swrFetcher
  )

  // Drop anyone without a linked userId since the backend keys
  // conversations on User, not Patient.
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

  // Client-side filter — fine for the page-100 dataset. Case-insensitive
  // match on first/last name combined.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return recipients
    return recipients.filter((r) =>
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q)
    )
  }, [recipients, search])

  // POST /conversations is idempotent by participant pair — if a thread
  // already exists with this user, the backend returns it with 200; if
  // not, it creates one and returns 201. Either way we treat the response
  // identically and hand the id to the parent to select.
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
