import { MetadataRoute } from 'next'
import { locales } from '@/i18n'

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ziro.agency'

  // Base routes that are the same for all locales
  const routes = [
    '',
    '/case-studies',
    '/contact',
  ]

  // Generate all localized URLs
  const localizedUrls = locales.flatMap(locale => 
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: (route === '' ? 'monthly' : 'weekly') as ChangeFrequency,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  return [...localizedUrls]
}