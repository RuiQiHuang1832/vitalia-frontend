import { headers } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

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


export async function getProviderAppointments({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number
  limit?: number
  status?: string[]
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
