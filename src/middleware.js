import { NextResponse } from 'next/server';

export function middleware(request) {
    console.log("testing middleware")
  // Get the token from cookies
  const token = request.cookies.get('authToken')?.value;

  // Define protected routes
  const protectedRoutes = ['/register'];

  // If no token and trying to access a protected route, redirect to login
  if (!token && protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next(); // Allow access if authenticated or public route
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/register'], // List protected routes here
};
