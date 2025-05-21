import { notFound } from 'next/navigation'
import { serviceService } from '@/lib/services/service.service'
import { Locale } from '@/i18n'

interface Props {
  params: { locale: Locale; slug: string }
}

export async function generateMetadata({ params: { locale, slug } }: Props) {
  const service = await serviceService.getServiceBySlug(slug, locale)

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: service.metaTitle || service.title,
    description: service.metaDescription || service.excerpt,
    keywords: service.keywords,
  }
}


export default async function ServicePage({ params: { locale, slug } }: Props) {
  const service = await serviceService.getServiceBySlug(slug, locale)

  if (!service || !service.isPublished) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-10" >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            headline: service.title,
            description: service.metaDescription || service.excerpt,
            image: service.imageUrl,
            datePublished: service.createdAt,
            name: service.title,
            author: {
              "@type": "Organization",
              name: "Zirospace"
            },
            publisher: {
              "@type": "Organization",
              name: "Zirospace",
              logo: {
                "@type": "ImageObject",
                url: "URL TO ZIROSPACE LOGO"
              }
            }
          }),
        }}
      />
      <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
      {service.subtitle && <h2 className="text-xl mb-4">{service.subtitle}</h2>}
      {service.imageUrl && (
        <img
          src={service.imageUrl}
          alt={service.imageAlt || service.title}
          className="mb-4 rounded-lg shadow-md"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: service.contentHtml }} />
      <p className="text-gray-500 mt-4">Published: {service.createdAt}</p>
    </div>
  )
}
