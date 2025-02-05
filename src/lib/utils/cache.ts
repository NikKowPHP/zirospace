import { Locale } from '@/i18n';

export const CACHE_TAGS = {
  CASE_STUDIES: 'case-studies',
} as const;

export const CACHE_TIMES = {
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
} as const;

export const getCacheKey = (key: string, locale: Locale) => `${key}:${locale}`; 