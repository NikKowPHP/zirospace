import { serviceService } from '@/lib/services/service.service'
import { Locale } from '@/i18n'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'

interface Props {
  params: { locale: Locale; slug: string }
}

export async function generateStaticParams() {
  const locales = ['en', 'pl']
  const services = await Promise.all(
    locales.map(async (locale) => {
      return await serviceService.getServices(locale as Locale)
    })
  )

  const paths = locales.flatMap((locale, index) => {
    return services[index].map((service) => ({
      locale,
      slug: service.slug,
    }))
  })

  return paths
}

export async function generateMetadata({
  params: { locale, slug },
}: Props): Promise<Metadata> {
  const service = await serviceService.getServiceBySlug(slug, locale)

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  return {
    title: service.metaTitle || service.title,
    description: service.metaDescription,
    keywords: service.keywords?.join(', '),
  }
}

export default async function ServicePage({ params: { locale, slug } }: Props) {
  const service = await serviceService.getServiceBySlug(slug, locale)

  if (!service || !service.isPublished) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl text-center font-bold mb-5">{service.title}</h1>
      {service.subtitle && <h2 className="text-xl mb-3">{service.subtitle}</h2>}
      {service.imageUrl && (
        <div className="relative max-w-3xl h-96 mb-5">
          <Image
            src={service.imageUrl}
            alt={service.imageAlt || 'service image'}
            fill
            className="mb-5 rounded-lg shadow-md object-cover"
          />
        </div>
      )}

      <div dangerouslySetInnerHTML={{ __html: service.contentHtml }} />
    </div>
  )
}
