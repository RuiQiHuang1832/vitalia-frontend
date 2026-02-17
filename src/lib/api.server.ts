import { headers } from 'next/headers'

export async function getPatients({
  page = 1,
  limit = 10,
  name,
  status,
}: {
  page?: number
  limit?: number
  name?: string
  status?: string[]
}) {
  const headerList = await headers()

  const host = headerList.get('host')
  const forwardedProto = headerList.get('x-forwarded-proto')
  const protocol = forwardedProto ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https')

  const cookieHeader = headerList.get('cookie') || ''

  const baseUrl = host ? `${protocol}://${host}` : 'http://localhost:3000'
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (name) {
    params.append('name', name)
  }

  if (status && status.length > 0) {
    status.forEach((s) => params.append('status', s))
  }

  const url = new URL(`/api/patients?${params.toString()}`, baseUrl)

  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      Cookie: cookieHeader,
    },
  })
  if (!res.ok) {
    console.log('Status:', res.status)
    throw new Error('Failed to fetch patients')
  }

  return res.json()
}
