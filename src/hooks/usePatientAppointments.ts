import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import type {
  AppointmentWithProvider,
  PatientAppointmentsResponse,
} from '@/app/(app)/(patient)/portal/appointments/types'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'

export type UsePatientAppointmentsArgs = {
  enabled?: boolean
  page?: number
  limit?: number
  status?: AppointmentWithProvider['status'][]
  initialData?: PatientAppointmentsResponse
}

export function usePatientAppointments({
  enabled = true,
  page = 1,
  limit = 10,
  status,
  initialData,
}: UsePatientAppointmentsArgs) {
  const patientId = useAuthStore((s) => s.patientId)

  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status && status.length > 0) {
    status.forEach((s) => params.append('status', s))
  }

  const key = enabled && patientId ? `/appointments/patient/${patientId}?${params}` : null

  return useSWR<PatientAppointmentsResponse>(key, swrFetcher, {
    fallbackData: initialData,
    keepPreviousData: false,
  })
}
