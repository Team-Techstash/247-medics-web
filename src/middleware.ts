import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('authToken')?.value
    const isAppointmentRoute = request.nextUrl.pathname.startsWith('/appointments')
    const isVideoConsultationRoute = request.nextUrl.pathname.includes('/video-consultation')

    // If trying to access appointment routes without auth token, redirect to login
    // Skip auth check for video consultation routes
    if (isAppointmentRoute && !authToken && !isVideoConsultationRoute) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/appointments/:path*',
        '/appointment/:path*'
    ],
} 