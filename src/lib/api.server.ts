import { cookies } from 'next/headers'

import { apiUrl } from './api.shared'

export async function getPatients() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const res = await fetch(apiUrl('/patients'), {
    cache: 'no-store',
    headers: {
      Cookie: cookieHeader,
    },
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch patients')

  return res.json()
}
