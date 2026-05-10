import MessagesClient from '@/app/(app)/messages/components/MessagesClient'
import { getConversations, getCurrentUserId } from '@/lib/api.server'

// Server component — runs on the request, fetches the conversation list
// using the auth cookie forwarded from the incoming request. The result
// is passed to the client as fallbackData for SWR to hydrate from.
export default async function MessagesPage() {
  const [initialData, initialCurrentUserId] = await Promise.all([
    getConversations(),
    getCurrentUserId(),
  ])

  return (
    <div className="h-full">
      <section className="space-y-3">
        <h1 className="text-left font-semibold text-3xl">Messages</h1>
        <p className="text-muted-foreground">
          Direct messages between patients and their providers.
        </p>
      </section>
      <MessagesClient
        initialData={initialData}
        initialCurrentUserId={initialCurrentUserId}
      />
    </div>
  )
}
