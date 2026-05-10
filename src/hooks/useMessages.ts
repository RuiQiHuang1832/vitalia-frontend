import type { MessagesPage } from '@/app/(app)/messages/types'
import { swrFetcher } from '@/lib/fetcher'
import useSWRInfinite from 'swr/infinite'

const PAGE_SIZE = 30

// Cursor-paginated message history for a single conversation. Backend
// returns messages newest-first; we keep that ordering in the cache and
// reverse for display in the thread component.
//
// useSWRInfinite calls getKey(pageIndex, previousPageData) for each page:
//   - pageIndex 0  → first request, no cursor
//   - pageIndex N  → use previousPageData.nextCursor, or stop if it's null
//
// Returning null from getKey tells SWR "no more pages" — that's how we
// stop fetching once the backend reports no older messages remain.
export function useMessages(conversationId: number | null) {
  const getKey = (pageIndex: number, previousPageData: MessagesPage | null) => {
    if (conversationId == null) return null
    if (previousPageData && previousPageData.nextCursor === null) return null

    const params = new URLSearchParams({ limit: String(PAGE_SIZE) })
    if (pageIndex > 0 && previousPageData?.nextCursor) {
      params.set('cursor', String(previousPageData.nextCursor))
    }
    return `/conversations/${conversationId}/messages?${params.toString()}`
  }

  const swr = useSWRInfinite<MessagesPage>(getKey, swrFetcher, {
    revalidateFirstPage: false,
    keepPreviousData: true,
  })

  // Flatten all loaded pages into a single array of messages, then reverse
  // to ascending chronological order for rendering top-to-bottom.
  const messages = (swr.data ?? []).flatMap((page) => page.data).reverse()
  // hasMore reflects whether the most recent page returned a non-null
  // cursor — used to enable "load older" affordances in the UI.
  const lastPage = swr.data?.[swr.data.length - 1]
  const hasMore = lastPage ? lastPage.nextCursor !== null : true

  return { ...swr, messages, hasMore, pageSize: PAGE_SIZE }
}
