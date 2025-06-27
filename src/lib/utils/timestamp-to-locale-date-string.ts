import { Locale } from '@/i18n'

export function timestampToLocaleDateString(date: string, locale: Locale) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
