import type { MessagesPage } from '@/app/(app)/messages/types'
import { swrFetcher } from '@/lib/fetcher'
import useSWRInfinite from 'swr/infinite'

const PAGE_SIZE = 30

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

  // Backend returns newest-first; reverse for chronological top-to-bottom render.
  const messages = (swr.data ?? []).flatMap((page) => page.data).reverse()
  const lastPage = swr.data?.[swr.data.length - 1]
  const hasMore = lastPage ? lastPage.nextCursor !== null : true

  return { ...swr, messages, hasMore, pageSize: PAGE_SIZE }
}
