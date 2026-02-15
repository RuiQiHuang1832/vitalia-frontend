import { headers } from 'next/headers'

export async function getPatients() {
  const headerList = await headers()
  console.log('ENV:', process.env.NODE_ENV)

  const host = headerList.get('host')
  const forwardedProto = headerList.get('x-forwarded-proto')
  const protocol = forwardedProto ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https')

  const cookieHeader = headerList.get('cookie') || ''

  const baseUrl = host ? `${protocol}://${host}` : 'http://localhost:3000'
  const url = new URL('/api/patients', baseUrl)

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
