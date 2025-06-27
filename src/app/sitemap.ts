import { MetadataRoute } from 'next'
import { locales } from '@/i18n'
import { blogPostService } from '@/lib/services/blog-post.service'
import { caseStudyService } from '@/lib/services/case-study.service'
import { serviceService } from '@/lib/services/service.service'
import { siteUrl } from '@/config/constants';
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
import { Service } from '@/domain/models/models';

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
        lastModified: post.created_at,
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
        lastModified: study.created_at,
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

  // Get all service pages for each locale
  const serviceUrls = await Promise.all(
    locales.map(async (locale) => {
      try {
        const services = await serviceService.getServices(locale);
        return services
          .filter((service: Service) => service.slug && service.created_at) // Filter out services with missing slug or created_at
          .map((service: Service) => ({
            url: `${baseUrl}/${locale}/services/${service.slug}`,
            lastModified: service.created_at,
            changeFrequency: 'weekly' as ChangeFrequency,
            priority: 0.7,
          }));
      } catch (error) {
        console.error(`Error fetching services for locale ${locale}:`, error);
        return []; // Return an empty array to prevent sitemap generation from failing
      }
    })
  )

  // Flatten the service URLs array
  const flattenedServiceUrls = serviceUrls.flat()

  return [
    ...localizedUrls,
    ...flattenedBlogUrls,
    ...flattenedCaseStudyUrls,
    ...healthcareRoutes,
    ...flattenedServiceUrls
  ]
}
