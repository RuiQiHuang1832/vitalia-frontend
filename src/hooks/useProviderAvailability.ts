import type { ProviderAvailability } from '@/app/(app)/(provider)/patients/types'
import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'

export function useProviderAvailability() {
  const providerId = useAuthStore((s) => s.providerId)

  return useSWR<ProviderAvailability>(providerId ? `/availability/${providerId}` : null, swrFetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  })
}
