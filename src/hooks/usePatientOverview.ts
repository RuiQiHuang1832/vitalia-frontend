import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'
import type { PatientFull } from '@/app/(app)/(provider)/patients/types'

export function usePatientOverview(id: number, fallbackData?: PatientFull) {
  return useSWR<PatientFull>(`/patients/${id}`, swrFetcher, {
    fallbackData,
    revalidateOnMount: !fallbackData, // skip refetch if SSR data exists
  })
}
