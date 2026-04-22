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
    switch (role) {
      case 'PATIENT':
        return NextResponse.redirect(new URL('/portal/appointments', req.url))
      case 'PROVIDER':
        return NextResponse.redirect(new URL('/dashboard', req.url))
      case 'ADMIN':
        return NextResponse.redirect(new URL('/admin/users', req.url))
    }
  }
  return null
}


const providerRoutes = ['/dashboard', '/appointments', '/patients', '/availability', '/audit-logs', '/account']

function enforceRoleRoutes(req: NextRequest, role: Role) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/portal') && role !== 'PATIENT') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  if (providerRoutes.some(r => pathname.startsWith(r)) && role !== 'PROVIDER') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  if (pathname.startsWith('/admin')) {
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    if (pathname === '/admin' || pathname === '/admin/') {
      return NextResponse.redirect(new URL('/admin/users', req.url))
    }
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
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/appointments/:path*',
    '/patients/:path*',
    '/availability/:path*',
    '/audit-logs/:path*',
    '/account/:path*',
    '/portal/:path*',
    '/admin/:path*',
  ],
}
