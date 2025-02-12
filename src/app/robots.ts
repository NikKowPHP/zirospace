import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ziro.space'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog',
          '/blog/*',
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/private/*',
          '/draft/*',
          '/*?*', // Prevent crawling of URLs with query parameters
          '/*/preview', // Prevent crawling of preview pages
          '/*.json', // Prevent crawling of JSON files
        ],
      },
      {
        userAgent: 'Google-Extended',
        allow: [
          '/',
          '/blog/*',
        ],
        disallow: ['/admin/*', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 