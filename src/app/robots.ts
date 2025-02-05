import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://ziro.agency'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*', '/api/*'],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 