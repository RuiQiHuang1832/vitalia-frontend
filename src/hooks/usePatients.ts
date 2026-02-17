import {  PatientsResponse } from '@/app/(app)/(provider)/patients/types'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'

export function usePatients(
  page: number,
  limit: number,
  nameFilter?: string,
  statusFilter?: string[],
  initialData?: PatientsResponse,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  
  if (nameFilter) {
    params.append('name', nameFilter)
  }
  
  if (statusFilter && statusFilter.length > 0) {
    statusFilter.forEach((status) => params.append('status', status))
  }

  if (sortBy) {
    params.append('sortBy', sortBy)
  }

  if (sortOrder) {
    params.append('sortOrder', sortOrder)
  }
  
  const key = `/patients/?${params.toString()}`

  return useSWR<PatientsResponse>(key, swrFetcher, { fallbackData: initialData, keepPreviousData: true })
}
