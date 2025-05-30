import { serviceService } from '@/lib/services/service.service'
import { Locale } from '@/i18n'
import { Metadata } from 'next'
import { Service } from '@/domain/models/service.model'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  params: { locale: Locale }
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pl' }]
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Our Services | ZIRO`,
  }
}

const stripHtmlTags = (htmlString: string) => {
  if (!htmlString) {
    return '' // Handle null, undefined, or empty strings
  }
  // Use a regular expression to find and replace HTML tags
  // <   : Matches the opening angle bracket
  // [^>] : Matches any character EXCEPT a closing angle bracket
  // *   : Matches the previous character zero or more times
  // >   : Matches the closing angle bracket
  // g   : Global flag - replace all occurrences, not just the first
  return htmlString.replace(/<[^>]*>/g, '')
}

async function getServices(locale: Locale) {
  try {
    const services = await serviceService.getServices(locale)
    return services
      .filter((service) => service.isPublished)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return []
  }
}

export default async function ServicesPage({ params: { locale } }: Props) {
  const services = await getServices(locale)

  return (
    <div className="max-w-3xl py-10 mx-auto ">
      <h1 className="text-3xl text-center font-bold mb-5">Our Services</h1>

      <ul className="" itemScope itemType="https://schema.org/ItemList">
        {services.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            locale={locale}
            position={service.orderIndex ?? 0}
          />
        ))}
      </ul>
    </div>
  )
}

const ServiceItem = ({
  service,
  locale,
  position,
}: {
  service: Service
  locale: Locale
  position: number
}) => {
  const cleanedExcerpt = stripHtmlTags(service.excerpt ? service.excerpt : '')

  return (
    <li
      className=""
      itemScope
      itemType="https://schema.org/BlogPosting"
      itemProp="itemListElement"
    >
      <Link
        href={`/${locale}/services/${service.slug}`}
        className=""
        itemProp="url"
      >
        <div className="flex flex-wrap border-b  py-[32px] gap-[32px] justify-between">
          <div className="flex flex-col gap-[4px]">
            <h2 className=" font-semibold  text-[19px]" itemProp="headline">
              {service.title}
            </h2>
            <p className="text-[15px]">
              {cleanedExcerpt}
              {/* Empowering Healthcare Innovation Through Human-Centered Design and */}
              {/* Collaborative Solutions */}
            </p>
          </div>
          {service.imageUrl && (
            <div
              itemProp="image"
              className="w-full sm:w-[400px]  aspect-video overflow-hidden relative"
            >
              <Image
                className="rounded-xl w-full h-auto "
                src={service.imageUrl}
                // src="https://picsum.photos/250/150"
                alt={service.imageAlt || service.title}
                style={{ objectFit: 'cover' }}
                fill
                loading="lazy"
              />
            </div>
          )}
        </div>
        <meta itemProp="position" content={String(position)} />
      </Link>
    </li>
  )
}
