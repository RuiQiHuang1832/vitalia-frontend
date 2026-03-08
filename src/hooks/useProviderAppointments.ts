import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'
import {type Appointment, type AppointmentResponse} from '../app/(app)/(provider)/patients/types'

export type ProviderAppointmentsResponse = {
  enabled?: boolean
  page?: number
  limit?: number
  status?: Appointment['status'][]
  initialData?: AppointmentResponse
}

export function useProviderAppointments({enabled = true, page = 1, limit = 10, status, initialData}: ProviderAppointmentsResponse) {
  const providerId = useAuthStore((s) => s.providerId)

  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status && status.length > 0) {
    status.forEach((s) => params.append('status', s))
  }
  const key = enabled && providerId ? `/appointments/provider/${providerId}?${params}` : null

  return useSWR(key, swrFetcher, {
    fallbackData: initialData,
    keepPreviousData: false, // smooth pagination transitions
  })
}
