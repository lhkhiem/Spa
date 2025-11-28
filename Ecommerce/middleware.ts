import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Set no-cache headers for pages with dynamic metadata to prevent social media crawlers from caching
  const pathname = request.nextUrl.pathname;
  
  // Pages that have dynamic metadata from CMS
  const dynamicMetadataPaths = [
    '/about',
    '/contact',
    '/products',
    '/posts',
  ];
  
  // Check if this is a dynamic metadata page
  const isDynamicMetadataPage = dynamicMetadataPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (isDynamicMetadataPage) {
    // Set headers to prevent caching by social media crawlers (Zalo, Facebook, etc.)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/about',
    '/contact',
    '/products/:path*',
    '/posts/:path*',
  ],
};





