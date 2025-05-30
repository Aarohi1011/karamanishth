import { NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
export function middleware(request) {
  const token = request.cookies.get('auth')?.value
  const role = request.cookies.get('role')?.value
  const path = request.nextUrl.pathname
  const detail = auth();
  // Teacher route protection
  if (path.startsWith('/employee')) {
    if (!token || role !== 'Staff') {
      
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Head route protection
  if (path.startsWith('/admin')) {
    if (!token || role !== 'Owner') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  // Default allow
  return NextResponse.next()
}
