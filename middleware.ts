import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (
          req.nextUrl.pathname === '/' ||
          req.nextUrl.pathname.startsWith('/auth') ||
          req.nextUrl.pathname.startsWith('/api/auth')
        ) {
          return true;
        }
        // Require auth for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/composer/:path*', '/calendar/:path*', '/cv-assistant/:path*', '/settings/:path*'],
};

