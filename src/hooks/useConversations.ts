import type { ConversationsResponse } from '@/app/(app)/messages/types'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'

// Returns the current user's conversations. The server resolves identity
// from the auth cookie, so this hook takes no userId arg.
//
// fallbackData lets the page hydrate immediately from the server-component
// initial fetch; SWR still revalidates in the background on mount/focus.
//
// Real-time updates land in step 4 (sockets) — for now, the list refreshes
// on focus, on send (we mutate manually), and on full page reload.
export function useConversations(initialData?: ConversationsResponse) {
  return useSWR<ConversationsResponse>('/conversations', swrFetcher, {
    fallbackData: initialData,
  })
}
