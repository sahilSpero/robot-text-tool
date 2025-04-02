import { NextResponse } from 'next/server';

export function middleware(request) {
    console.log("Middleware executing...");

    // Get the token from cookies
    const token = request.cookies.get('authToken')?.value;
    console.log("Token from cookies:", token);

    // Define protected and restricted routes
    const authRoutes = [ '/','/login', '/register']; // Routes that should be accessible only when not logged in
    const protectedRoutes = ['/dashboard']; // Routes that should be accessible only when logged in

    const currentPath = request.nextUrl.pathname;

    // If the user is logged in and tries to access an auth route, redirect to dashboard
    if (token && authRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If the user is NOT logged in and tries to access a protected route, redirect to login
    if (!token && protectedRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next(); // Allow access otherwise
}

// Apply middleware to relevant routes
export const config = {
    matcher: ['/login', '/register', '/dashboard', "/"],
};
