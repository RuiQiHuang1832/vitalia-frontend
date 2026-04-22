import { UsersFilters, UsersResponse } from '@/app/(app)/admin/users/types'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'

export function useUsers(
  page: number,
  limit: number,
  filters?: UsersFilters,
  fallbackData?: UsersResponse
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (filters?.role) {
    params.append('role', filters.role)
  }

  const key = `/users/?${params.toString()}`

  return useSWR<UsersResponse>(key, swrFetcher, {
    keepPreviousData: true,
    fallbackData,
  })
}
