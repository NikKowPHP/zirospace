import { notFound } from 'next/navigation'
import { type Locale } from '@/i18n'
import Image from 'next/image'
import { Suspense } from 'react'
import { caseStudyService } from '@/lib/services/case-study.service'
import logger from '@/lib/logger'
import { siteUrl } from '@/config/constants'
import { CaseStudy } from '@/domain/models/models'
import { timestampToLocaleDateString } from '@/lib/utils/timestamp-to-locale-date-string'
interface PageProps {
  params: Promise<{
    slug: string
    locale: Locale
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate metadata for the case study page
export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: Locale }
}) {
  const { slug, locale } = params
  const caseStudy = await fetchCaseStudy(slug, locale)
  logger.log(caseStudy)
  return {
    title: {
      default: `${caseStudy.title} | ZIRO Case Study`,
      template: '%s | ZIRO Healthcare Technology',
    },
    description: caseStudy.description,
    keywords: [
      ...caseStudy.tags,
      'case study',
      'healthcare technology',
      'medical software',
    ],
    alternates: {
      canonical: `${siteUrl}/${locale}/case-studies/${slug}`,
      languages: {
        'en-US': `${siteUrl}/en/case-studies/${slug}`,
        'pl-PL': `${siteUrl}/pl/case-studies/${slug}`,
      },
    },
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.description,
      type: 'article',
      publishedTime: caseStudy.created_at,
      images: [
        {
          url: caseStudy.images.length > 0 ? caseStudy.images[0].url : 'http',
          width: 1200,
          height: 630,
          alt: caseStudy.images[0].alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: caseStudy.title,
      description: caseStudy.description,
      images: [caseStudy.images[0].url],
    },
  }
}

// Loading component
function CaseStudyLoading() {
  return (
    <div className="bg-white pt-20 animate-pulse">
      <div className="container mx-auto pt-32 pb-16">
        <div className="max-w-5xl mx-auto mb-[50px]">
          <div className="relative w-full aspect-[16/9] mb-16 bg-gray-200 rounded-lg" />
          <div className="grid lg:grid-cols-[2fr,1fr] gap-16">
            <div>
              <div className="h-12 bg-gray-200 rounded mb-8 w-3/4" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
            <div className="space-y-8">
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CaseStudyError() {
  return (
    <div className="bg-white h-svh  flex flex-col justify-center items-center">
      <div className="container  mx-auto pt-32 pb-16 text-center">
        <h1 className="text-2xl font-medium text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t load the case study. Please try again later.
        </p>
      </div>
    </div>
  )
}
async function fetchCaseStudy(
  slug: string,
  locale: Locale
): Promise<CaseStudy> {
  const caseStudy = await caseStudyService.getCaseStudyBySlug(slug, locale)
  if (!caseStudy) notFound()
  return caseStudy
}
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { slug, locale } = resolvedParams
  return (
    <Suspense fallback={<CaseStudyLoading />}>
      <CaseStudyContent slug={slug} locale={locale} />
    </Suspense>
  )
}

// Content component with SEO improvements
async function CaseStudyContent({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}) {
  try {
    const caseStudy = await fetchCaseStudy(slug, locale)

    let [heroImage, ...otherImages] = caseStudy.images

    // Create JSON-LD structured data
    const caseStudyJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: caseStudy.title,
      description: caseStudy.description,
      image: caseStudy.images.map((img: { url: string }) => img.url),
      datePublished: caseStudy.created_at,
      author: {
        '@type': 'Organization',
        name: 'ZIRO Healthcare Solutions',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ZIRO Healthcare Solutions',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/ziro.avif`,
        },
      },
      keywords: caseStudy.tags.join(', '),
      articleSection: 'Case Study',
      inLanguage: locale,
    }

    // Create breadcrumb JSON-LD
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Case Studies',
          item: `${siteUrl}/${locale}/case-studies`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: caseStudy.title,
          item: `${siteUrl}/${locale}/case-studies/${slug}`,
        },
      ],
    }

    const getImageLayout = (index: number) => {
      const position = index % 4
      return {
        isFullWidth: position === 0 || position === 1,
        isSplitColumn: position === 2 || position === 3,
      }
    }

    function renderMetaData(caseStudy: CaseStudy, locale: Locale) {
      return (
        <>
          <meta itemProp="headline" content={caseStudy.title} />
          <meta itemProp="description" content={caseStudy.title} />
          <meta itemProp="inLanguage" content={locale} />
          <meta
            itemProp="datePublished"
            content={caseStudy.created_at.toString()}
          />
          <meta
            itemProp="dateModified"
            content={caseStudy.created_at.toString()}
          />
          <meta itemProp="author" content="ZIRO Healthcare Solutions" />
          <meta itemProp="publisher" content="ZIRO Healthcare Solutions" />
        </>
      )
    }

    const calculateReadingTime = () => {
      const wordsPerMinute = 200
      let totalWords = caseStudy.description.trim().split(/\s+/).length
      caseStudy.images.forEach((image) => {
        if (image.alt) {
          totalWords += image.alt.trim().split(/\s+/).length
        }
      })
      const readingTime = Math.ceil(totalWords / wordsPerMinute)
      return readingTime
    }

    const readingTime = calculateReadingTime()
    return (
      <>
        <article
          className="blog-caseStudy  py-[100px] max-w-5xl mx-auto flex flex-col gap-[35px] spectral-regular"
          itemScope
          itemType="https://schema.org/Article"
        >
          {renderMetaData(caseStudy, locale)}

          {/* Hero Section */}

          <header className="flex flex-col ">
            <div className="flex flex-col gap-8">
              <h1
                className="text-[32px] leading-[1.2] font-bold mb-[12px] "
                itemProp="name"
              >
                {caseStudy.title}
              </h1>

              {caseStudy.subtitle && (
                <p
                  className="text-[18px] text-gray-500 "
                  itemProp="abstract"
                  dangerouslySetInnerHTML={{
                    __html: caseStudy.subtitle.trim(),
                  }}
                ></p>
              )}
              <div className="text-[11px] text-gray-600 flex  gap-4 pb-[15px] border-b ">
                <time dateTime={caseStudy.created_at.toString()}>
                  {new Date(caseStudy.created_at).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {timestampToLocaleDateString(caseStudy.created_at, locale)}
                </time>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
            </div>

            <div className="w-full flex items-center justify-center py-[35px] border-b">
              <div itemProp="image" className="w-full h-[500px] mx-auto">
                <div className="relative h-[500px] w-full  mb-16">
                  <Image
                    src={heroImage.url}
                    alt={
                      heroImage.alt
                        ? heroImage.alt
                        : `${caseStudy.title} Case Study Hero Image`
                    }
                    fill
                    className="rounded-primary-lg object-cover"
                    priority
                    itemProp="image"
                    quality={100}
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </header>

          {/*  Image Gallery */}
          <section className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="space-y-[20px]">
                {otherImages.map(
                  (image: { url: string; alt: string }, index: number) => {
                    const { isFullWidth, isSplitColumn } = getImageLayout(index)

                    // If it's a split column image and it's the first of the pair (even index)
                    if (isSplitColumn && index % 2 === 0) {
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-2 gap-[20px]"
                        >
                          {/* Current Image */}
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              fill
                              quality={100}
                              className="object-cover rounded-primary-lg"
                              unoptimized
                            />
                          </div>
                          {/* Next Image (if exists) */}
                          {otherImages[index + 1] && (
                            <div className="relative aspect-[4/3]">
                              <Image
                                src={otherImages[index + 1].url}
                                alt={otherImages[index + 1].alt}
                                fill
                                quality={100}
                                className="object-cover rounded-primary-lg"
                                unoptimized
                              />
                            </div>
                          )}
                        </div>
                      )
                    }
                    // Skip the second image of split columns as it's handled above
                    else if (isSplitColumn && index % 2 !== 0) {
                      return null
                    }
                    // Full width images
                    else if (isFullWidth) {
                      return (
                        <div key={index} className="relative aspect-[16/9]">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            quality={100}
                            className="object-cover rounded-primary-lg"
                            unoptimized
                          />
                        </div>
                      )
                    } else {
                      return (
                        <div key={index} className="relative aspect-[4/3]">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            quality={100}
                            className="object-cover rounded-primary-lg"
                            unoptimized
                          />
                        </div>
                      )
                    }
                  }
                )}
              </div>
            </div>
          </section>
        </article>

        {/* Add JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </>
    )
  } catch (error) {
    logger.log('Error loading case study:', error)
    return <CaseStudyError />
  }
}
