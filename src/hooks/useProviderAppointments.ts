import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { swrFetcher } from '@/lib/fetcher'
import useSWR from 'swr'

export function useProviderAppointments(enabled = true) {
  const providerId = useAuthStore((s) => s.providerId)

  const key = enabled && providerId ? `/appointments/provider/${providerId}` : null

  return useSWR(key, swrFetcher)
}
