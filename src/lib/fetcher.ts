import { refreshAccessToken } from './auth'

export const swrFetcher = async (url: string) => {
  let res = await fetch(`/api${url}`, { credentials: 'include' })

  if (res.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      res = await fetch(`/api${url}`, { credentials: 'include' })
    }
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.message ?? `Failed to fetch ${url} (${res.status})`)
  }

  return data
}
