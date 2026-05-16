import type { ConversationsResponse } from '@/app/(app)/messages/types'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'

export function useConversations(initialData?: ConversationsResponse) {
  return useSWR<ConversationsResponse>('/conversations', swrFetcher, {
    fallbackData: initialData,
  })
}
