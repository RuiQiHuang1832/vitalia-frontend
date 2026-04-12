import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'
import { type Appointment } from '../app/(app)/(provider)/patients/types'

type Params = {
  enabled?: boolean
  status?: Appointment['status'][]
  fromDate?: string
  endTimeAfter?: string
  endTimeBefore?: string
}

export function useProviderAppointmentCount({
  enabled = true,
  status,
  fromDate,
  endTimeAfter,
  endTimeBefore,
}: Params) {
  const providerId = useAuthStore((s) => s.providerId)

  const params = new URLSearchParams()
  if (status && status.length > 0) {
    status.forEach((s) => params.append('status', s))
  }
  if (fromDate) params.append('fromDate', fromDate)
  if (endTimeAfter) params.append('endTimeAfter', endTimeAfter)
  if (endTimeBefore) params.append('endTimeBefore', endTimeBefore)

  const key =
    enabled && providerId ? `/appointments/provider/${providerId}/count?${params}` : null

  return useSWR<{ count: number }>(key, swrFetcher)
}
