import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, pathnames } from './i18n';

export default createIntlMiddleware({
  locales,
  pathnames,
  defaultLocale,
  localePrefix: 'always',
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|admin|images|favicon.ico|manifest.json).*)'
  ],
};