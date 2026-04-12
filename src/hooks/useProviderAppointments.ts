import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'
import {type Appointment, type AppointmentResponse} from '../app/(app)/(provider)/patients/types'

export type ProviderAppointmentsResponse = {
  enabled?: boolean
  page?: number
  limit?: number
  status?: Appointment['status'][]
  fromDate?: string
  endTimeAfter?: string
  endTimeBefore?: string
  initialData?: AppointmentResponse
}

export function useProviderAppointments({enabled = true, page = 1, limit = 10, status, fromDate, endTimeAfter, endTimeBefore, initialData}: ProviderAppointmentsResponse) {
  const providerId = useAuthStore((s) => s.providerId)

  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status && status.length > 0) {
    status.forEach((s) => params.append('status', s))
  }
  if (fromDate) {
    params.append('fromDate', fromDate)
  }
  if (endTimeAfter) {
    params.append('endTimeAfter', endTimeAfter)
  }
  if (endTimeBefore) {
    params.append('endTimeBefore', endTimeBefore)
  }
  const key = enabled && providerId ? `/appointments/provider/${providerId}?${params}` : null

  return useSWR(key, swrFetcher, {
    fallbackData: initialData,
    keepPreviousData: false, // smooth pagination transitions
  })
}
