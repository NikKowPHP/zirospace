import { Locale } from '@/i18n';

export const CACHE_TAGS = {
  CASE_STUDIES: 'case-studies',
  TESTIMONIALS: 'testimonials',
  CASE_STUDY_SLIDERS: 'case-study-sliders',
  BLOG_POSTS: 'blog-posts',
  BANNERS: 'banners',
} as const;

export const CACHE_TIMES = {
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
} as const;

export const getCacheKey = (key: string, locale: Locale) => `${key}:${locale}`; 