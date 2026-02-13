
export const swrFetcher = async (url: string) => {
  const res = await fetch(`/api${url}`, { credentials: 'include' })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? `Failed to fetch ${url} (${res.status})`)
  }

  return data
}
