import { MetadataRoute } from 'next'
import { locales } from '@/i18n'
import { blogPostService } from '@/lib/services/blog-post.service'
import { caseStudyService } from '@/lib/services/case-study.service'
import { siteUrl } from '@/config/constants';
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;

  // Base routes that are the same for all locales
  const routes = [
    '',
    '/case-studies',
    '/contact',
    '/blog'
  ]

  // Generate all localized URLs for static pages
  const localizedUrls = locales.flatMap(locale => 
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: (route === '' ? 'monthly' : 'weekly') as ChangeFrequency,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  // Get all blog posts for each locale
  const blogUrls = await Promise.all(
    locales.map(async (locale) => {
      const posts = await blogPostService.getBlogPosts(locale)
      return posts.map(post => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: post.createdAt,
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.7,
      }))
    })
  )

  // Flatten the blog URLs array
  const flattenedBlogUrls = blogUrls.flat()

  // Get all case study pages for each locale
  const caseStudyUrls = await Promise.all(
    locales.map(async (locale) => {
      const caseStudies = await caseStudyService.getCaseStudies(locale)
      return caseStudies.map(study => ({
        url: `${baseUrl}/${locale}/case-studies/${study.slug}`,
        lastModified: study.createdAt,
        changeFrequency: 'weekly' as ChangeFrequency,
        priority: 0.7,
      }))
    })
  )

  // Flatten the case study URLs array
  const flattenedCaseStudyUrls = caseStudyUrls.flat()

  // Healthcare-specific routes
  const healthcareRoutes = locales.flatMap(locale => [
    {
      url: `${baseUrl}/${locale}/healthcare-solutions`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${locale}/medical-software`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.9,
    }
  ])

  return [
    ...localizedUrls,
    ...flattenedBlogUrls,
    ...flattenedCaseStudyUrls,
    ...healthcareRoutes
  ]
}