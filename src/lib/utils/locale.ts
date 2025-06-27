import { Locale } from '@/i18n';

export function validateLocale(locale: string | null): Locale {
  if (!locale || (locale !== 'en' && locale !== 'pl')) {
    throw new Error('Locale is required and must be "en" or "pl"');
  }
  return locale as Locale;
}