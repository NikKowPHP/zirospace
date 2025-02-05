import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'pl'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

// Define your path patterns
export const pathnames = {
  '/': '/',
  '/about': '/about',
  '/services': '/services',
  '/contact': '/contact',
  '/404': '/404',
  '/work': '/work'
} as const;

// Use createLocalizedPathnamesNavigation instead of createSharedPathnamesNavigation
export const { Link, redirect, usePathname, useRouter } = createLocalizedPathnamesNavigation({
  locales,
  pathnames,
  localePrefix: 'always'
});