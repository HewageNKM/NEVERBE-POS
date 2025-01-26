import { NextResponse } from 'next/server';

export function middleware(req:Request) {
    const origin = req.headers.get('origin');

    if (!origin) {
        // No Origin header indicates a same-origin request
        console.log('Allowed: Same-origin request');
        return NextResponse.next(); // Allow the request
    }

    if (origin === 'https://pos.neverbe.lk') {
        // Cross-origin request from allowed origin
        console.log(`Allowed: Cross-origin request from ${origin}`);
        return NextResponse.next(); // Allow the request
    }

    // Block requests from other origins
    console.log(`Blocked: Request from unknown origin: ${origin}`);
    return new NextResponse('Forbidden', { status: 403 });
}

// Apply the middleware to all API routes
export const config = {
    matcher: '/api/:path*',
};