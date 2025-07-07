// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, pathnames } from './i18n';

export default async function middleware(request: NextRequest) {
  // Step 1: Check if the request is for the root URL
  if (request.nextUrl.pathname === '/') {
    // Step 2: Rewrite to the default locale's root path
    return NextResponse.rewrite(new URL(`/${defaultLocale}`, request.url));
  }

  // Step 3: Let next-intl handle all other paths
  const handleI18nRouting = createIntlMiddleware({
    locales,
    pathnames,
    defaultLocale,
    localePrefix: 'always',
  });

  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/', // Match the root path specifically for our rewrite
    '/((?!api|_next/static|_next/image|admin|images|favicon.ico|manifest.json|robots.txt|sitemap.xml).*)'
  ],
};