import {  PatientsResponse } from '@/app/(app)/(provider)/patients/types'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'

export function usePatients(initialData: PatientsResponse) {
  const key = `/patients`

  return useSWR<PatientsResponse>(key, swrFetcher, { fallbackData: initialData })
}
