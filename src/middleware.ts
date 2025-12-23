import { jwtDecode } from 'jwt-decode'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type Role = 'PATIENT' | 'PROVIDER' | 'ADMIN'
type JwtPayload = { role: Role }

function getRole(req: NextRequest): Role | null {
  const token = req.cookies.get('accessToken')?.value
  if (!token) return null

  try {
    return jwtDecode<JwtPayload>(token).role
  } catch {
    return null
  }
}

function redirectLoggedInFromLogin(req: NextRequest, role: Role) {
  if (req.nextUrl.pathname === '/login') {
    return role === 'PATIENT'
      ? NextResponse.redirect(new URL('/patient', req.url))
      : NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return null
}

function enforceRoleRoutes(req: NextRequest, role: Role) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/patient') && role !== 'PATIENT') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  if (pathname.startsWith('/dashboard') && role === 'PATIENT') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return null
}
export function middleware(req: NextRequest) {
  const role = getRole(req)
  if (!role) return NextResponse.next()
 
  const redirect = redirectLoggedInFromLogin(req, role)
  if (redirect) return redirect

  const enforced = enforceRoleRoutes(req, role)
  if (enforced) return enforced

  return NextResponse.next()
}


export const config = {
  matcher: ['/login', '/dashboard/:path*', '/patient/:path*'],
}
