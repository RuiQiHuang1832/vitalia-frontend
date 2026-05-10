import type { Allergy, Medication } from '@/app/(app)/(provider)/patients/types'
import { jwtDecode } from 'jwt-decode'
import { headers } from 'next/headers'

type TokenPayload = {
  id: number
  email: string
  role: string
  providerId: number | null
  patientId: number | null
}

async function getServerRequestContext() {
  const headerList = await headers()

  const host = headerList.get('host')
  const forwardedProto = headerList.get('x-forwarded-proto')
  const protocol = forwardedProto ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https')

  const cookieHeader = headerList.get('cookie') || ''
  const baseUrl = host ? `${protocol}://${host}` : 'http://localhost:3000'

  const token = cookieHeader
    .split('; ')
    .find((c) => c.startsWith('accessToken='))
    ?.split('=')
    .slice(1)
    .join('=')

  const decoded = token ? jwtDecode<TokenPayload>(token) : null

  return { baseUrl, cookieHeader, decoded }
}

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
  const { baseUrl, cookieHeader } = await getServerRequestContext()

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

export async function getPatientById(id: number) {
  const { baseUrl, cookieHeader } = await getServerRequestContext()

  const url = new URL(`/api/patients/${id}`, baseUrl)

  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch patient ${id}`)
  }

  return res.json()
}

export async function getPatientAppointments({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number
  limit?: number
  status?: string[]
}) {
  const { baseUrl, cookieHeader, decoded } = await getServerRequestContext()

  const patientId = decoded?.patientId
  if (!patientId) {
    throw new Error('Patient ID not found in token')
  }

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (status && status.length > 0) {
    status.forEach((s) => params.append('status', s))
  }

  const url = new URL(`/api/appointments/patient/${patientId}?${params.toString()}`, baseUrl)

  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      Cookie: cookieHeader,
    },
  })
  if (!res.ok) {
    console.log('Status:', res.status)
    throw new Error('Failed to fetch patient appointments')
  }

  return res.json()
}

export async function getPatientVitals() {
  const { baseUrl, cookieHeader, decoded } = await getServerRequestContext()

  const patientId = decoded?.patientId
  if (!patientId) {
    throw new Error('Patient ID not found in token')
  }

  const url = new URL(`/api/vitals/patient/${patientId}`, baseUrl)

  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  })
  if (!res.ok) {
    console.log('Status:', res.status)
    throw new Error('Failed to fetch patient vitals')
  }

  return res.json()
}

export async function getPatientMedications(): Promise<Medication[]> {
  const { baseUrl, cookieHeader, decoded } = await getServerRequestContext()

  const patientId = decoded?.patientId
  if (!patientId) {
    throw new Error('Patient ID not found in token')
  }

  const url = new URL(`/api/medications/patient/${patientId}`, baseUrl)

  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  })
  if (!res.ok) {
    console.log('Status:', res.status)
    throw new Error('Failed to fetch patient medications')
  }

  const grouped = (await res.json()) as Record<string, Medication[]>
  return Object.values(grouped).flat()
}

export async function getPatientAllergies(): Promise<Allergy[]> {
  const { baseUrl, cookieHeader, decoded } = await getServerRequestContext()

  const patientId = decoded?.patientId
  if (!patientId) {
    throw new Error('Patient ID not found in token')
  }

  const url = new URL(`/api/allergies/patient/${patientId}`, baseUrl)

  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  })
  if (!res.ok) {
    console.log('Status:', res.status)
    throw new Error('Failed to fetch patient allergies')
  }

  const grouped = (await res.json()) as Record<string, Allergy[]>
  return Object.values(grouped).flat()
}

export async function getUsers({
  page = 1,
  limit = 10,
  role,
}: {
  page?: number
  limit?: number
  role?: string
}) {
  const { baseUrl, cookieHeader } = await getServerRequestContext()

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (role) {
    params.append('role', role)
  }

  const url = new URL(`/api/users?${params.toString()}`, baseUrl)

  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  })
  if (!res.ok) {
    console.log('Status:', res.status)
    throw new Error('Failed to fetch users')
  }

  return res.json()
}

// Server-side initial fetch for the messages page. Returns the current
// user's conversations sorted by most recent activity. Used as fallbackData
// for the SWR hook on the client so the first paint has data.
export async function getConversations() {
  const { baseUrl, cookieHeader } = await getServerRequestContext()

  const url = new URL(`/api/conversations`, baseUrl)

  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Cookie: cookieHeader },
  })
  if (!res.ok) {
    console.log('Status:', res.status)
    throw new Error('Failed to fetch conversations')
  }

  return res.json()
}

// The current user's id, decoded from the JWT cookie at request time.
// Passed to the messages page so the conversation list can resolve "the
// other participant" on first paint without waiting for client-side
// auth hydration (which would otherwise flash wrong names).
export async function getCurrentUserId(): Promise<number | null> {
  const { decoded } = await getServerRequestContext()
  return decoded?.id ?? null
}

// The current user's role, decoded from the JWT cookie at request time.
// Used by the app layout to render the correct sidebar variant on first
// paint — without this, the client falls back to the provider sidebar
// while Zustand auth is still hydrating.
export async function getCurrentRole(): Promise<'ADMIN' | 'PROVIDER' | 'PATIENT' | null> {
  const { decoded } = await getServerRequestContext()
  const role = decoded?.role
  if (role === 'ADMIN' || role === 'PROVIDER' || role === 'PATIENT') return role
  return null
}

export async function getProviderAppointments({
  page = 1,
  limit = 10,
  status,
  fromDate,
  endTimeAfter,
  endTimeBefore,
}: {
  page?: number
  limit?: number
  status?: string[]
  fromDate?: string
  endTimeAfter?: string
  endTimeBefore?: string
}) {
  const { baseUrl, cookieHeader, decoded } = await getServerRequestContext()

  const providerId = decoded?.providerId
  if (!providerId) {
    throw new Error('Provider ID not found in token')
  }

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (status && status.length > 0) {
    status.forEach((s) => params.append('status', s))
  }

  if (fromDate) {
    params.append('fromDate', fromDate)
  }

  if (endTimeAfter) {
    params.append('endTimeAfter', endTimeAfter)
  }

  if (endTimeBefore) {
    params.append('endTimeBefore', endTimeBefore)
  }

  const url = new URL(`/api/appointments/provider/${providerId}?${params.toString()}`, baseUrl)

  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      Cookie: cookieHeader,
    },
  })
  if (!res.ok) {
    console.log('Status:', res.status)
    throw new Error('Failed to fetch appointments')
  }

  return res.json()
}
