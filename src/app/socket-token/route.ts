import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Same-origin endpoint that hands the httpOnly accessToken to the client
// so socket.io can pass it via its auth handshake. Lives outside /api on
// purpose: vercel.json rewrites /api/* to the backend, which would
// bypass this handler in production.
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  return NextResponse.json({ token })
}
