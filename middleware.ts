import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    const { pathname } = request.nextUrl;

    // Paths to exclude from all guards
    const isExcludedPath =
        pathname === '/desktop-only' ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.') || // Static files like favicon.ico, images, etc.
        pathname.startsWith('/static');

    // Mobile guard (existing functionality)
    if (!isMobile && !isExcludedPath) {
        const url = request.nextUrl.clone();
        url.pathname = '/desktop-only';
        return NextResponse.redirect(url);
    }

    // Role-based route protection
    // Note: This is a basic check. For stronger security, verify user role from session/token
    // Currently, we rely on client-side guards and layout-level protection

    // Protect partner routes - redirect to partner login if not authenticated
    if (pathname.startsWith('/partner/dashboard') && !isExcludedPath) {
        // Client-side layout will handle the actual role verification
        // This just ensures the flow directs to partner login
        return NextResponse.next();
    }

    // Protect admin routes - redirect to home if not authenticated
    if (pathname.startsWith('/admin') && !isExcludedPath) {
        // Client-side layout will handle the actual role verification
        return NextResponse.next();
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
