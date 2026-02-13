import { headers } from 'next/headers'

export async function getPatients() {
  const headerList = await headers()

  const host = headerList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

  const cookieHeader = headerList.get('cookie') || ''

  const res = await fetch(`${protocol}://${host}/api/patients`, {
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
