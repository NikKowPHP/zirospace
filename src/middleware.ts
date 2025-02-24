import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, pathnames } from './i18n';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  defaultLocale,
  locales,
  pathnames,
  localePrefix: 'always'
});

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle public files and API routes
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel')
  ) {
    return NextResponse.next();
  }

  // Check if it's an admin route
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Handle root path redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Check if the pathname starts with a locale
  // const pathnameHasLocale = locales.some(
  //   locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  // );

  // if (pathnameHasLocale) {
  //   const pathWithoutLocale = pathname
  //     .split('/')
  //     .slice(2)
  //     .join('/');

  //   const isCaseStudyRoute = /^case-studies(\/[a-z0-9-]+)?$/.test(pathWithoutLocale);
  //   const isBlogRoute = /^blog(\/[a-z0-9-]+)?$/.test(pathWithoutLocale);

  //   const locale = pathname.split('/')[1];
    
  //   if (pathWithoutLocale && !isCaseStudyRoute && !isBlogRoute) {
  //     return NextResponse.redirect(new URL(`/${locale}/404`, request.url));
  //   }
  // }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\.[^/]*$).*)',
    '/api/auth/:path*'
  ]
}; 