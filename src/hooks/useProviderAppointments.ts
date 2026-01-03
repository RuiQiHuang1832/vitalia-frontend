import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import useSWR from 'swr'
import { swrFetcher } from '@/lib/fetcher'

export function useProviderAppointments(enabled = true) {
  const providerId = useAuthStore((s) => s.providerId)

  const key = enabled && providerId ? `/appointments/provider/${providerId}` : null

  return useSWR(key, swrFetcher)
}
// need to edit this
