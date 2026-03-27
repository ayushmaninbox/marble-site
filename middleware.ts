import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host')

  // Redirect to www. in production
  // We check for both the bare domain and common variants if needed
  if (process.env.NODE_ENV === 'production' && hostname === 'shreeradhemarbles.in') {
    url.hostname = 'www.shreeradhemarbles.in'
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

// Match all paths except static assets and API
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|Assets|uploads).*)',
  ],
}
