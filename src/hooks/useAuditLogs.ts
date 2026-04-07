import {
  AuditLogFilters,
  AuditLogsResponse,
} from '@/app/(app)/(provider)/audit-logs/types'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'

export function useAuditLogs(
  page: number,
  limit: number,
  filters?: AuditLogFilters
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (filters?.action) {
    params.append('action', filters.action)
  }

  if (filters?.entity) {
    params.append('entity', filters.entity)
  }

  if (filters?.userRole) {
    params.append('userRole', filters.userRole)
  }

  if (filters?.from) {
    params.append('from', filters.from)
  }

  if (filters?.to) {
    params.append('to', filters.to)
  }

  const key = `/audit-logs/?${params.toString()}`

  return useSWR<AuditLogsResponse>(key, swrFetcher, {
    keepPreviousData: true,
  })
}
