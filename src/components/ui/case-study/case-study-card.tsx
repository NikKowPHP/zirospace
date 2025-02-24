'use client'

import { memo } from 'react'
import { Button } from '@/components/ui/button/button'
import { Tag } from '@/components/ui/tag/tag'
import { cn } from '@/lib/utils/cn'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { type Image as ImageType } from '@/domain/models/case-study.model'
import { type CaseStudy } from '@/domain/models/case-study.model'
import { Locale } from '@/i18n'
import { ArrowUpRight } from 'lucide-react'
import { siteUrl } from '@/config/constants';
interface CaseStudyCardProps {
  caseStudy: CaseStudy
  locale: Locale
}

// Optimized image component with proper loading strategies
const CaseStudyImage = memo(function CaseStudyImage({
  url,
  alt,
  isFirst,
}: {
  url: string
  alt: string
  isFirst: boolean
}) {
  return (
    <div
      className={cn(
        'relative h-full w-full rounded-b-[32px]  lg:rounded-b-none lg:rounded-r-[32px]   overflow-hidden',
        isFirst ? 'col-span-2 row-span-2' : ''
      )}
      itemProp="image"
      itemScope
      itemType="https://schema.org/ImageObject"
    >
      <meta itemProp="contentUrl" content={url} />
      <meta itemProp="caption" content={alt} />
      <Image
        src={url}
        alt={alt}
        loading={'lazy'}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={isFirst ? 100 : 75}
      />
    </div>
  )
})

// Optimized tags component with semantic markup
const CaseStudyTags = memo(function CaseStudyTags({
  tags,
  theme,
}: {
  tags: string[]
  theme: string
}) {
  return (
    <div 
      className="flex flex-wrap"
      itemProp="keywords"
      aria-label="Project tags"
    >
      {tags.map((tag, index) => (
        <div key={tag} className="flex items-center">
          <span>
            <Tag
              variant={theme === 'dark' ? 'dark' : 'primary'}
              className="px-8 text-sm sm:text-base"
            >
              {tag}
            </Tag>
          </span>
          {index !== tags.length - 1 && (
            <span
              className="select-none mx-1 text-[10px] text-blue-500"
              aria-hidden="true"
            >
              •
            </span>
          )}
        </div>
      ))}
    </div>
  )
})

// Main component with enhanced SEO and accessibility
export const CaseStudyCard = memo(function CaseStudyCard({
  caseStudy,
  locale,
}: CaseStudyCardProps) {
  const t = useTranslations()
  const ctaText = t('caseStudy.ctaText.viewCaseStudy')
  const caseStudyUrl = `/${locale}/case-studies/${caseStudy.slug}`
  console.log('caseStudy.tags', caseStudy.tags)

  // JSON-LD for the case study
  const caseStudyJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": caseStudy.title,
    "headline": caseStudy.subtitle,
    "description": caseStudy.description,
    // "keywords":  caseStudy.tags ? caseStudy.tags.join(", ") : '',
    // "image": caseStudy.images.length > 0 && caseStudy.images[0]?.url ? caseStudy.images[0].url : '',
    "url": `${siteUrl}${caseStudyUrl}`,
    "datePublished": caseStudy.createdAt,
    "author": {
      "@type": "Organization",
      "name": "ZIRO Healthcare Solutions"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ZIRO Healthcare Solutions",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/ziro.avif`
      }
    }
  }

  return (
    <>
      <article
        className={`flex flex-col rounded-[24px] sm:rounded-[32px] shadow-sm h-full`}
        style={{
          color: caseStudy.color,
          backgroundColor: caseStudy.backgroundColor,
        }}
        itemScope
        itemType="https://schema.org/CreativeWork"
        role="article"
      >
        <Link 
          href={caseStudyUrl}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full"
          aria-label={`Read case study: ${caseStudy.title}`}
        >
          <div className="flex flex-col h-full p-[20px] sm:p-[40px] gap-[20px]">
            {/* Title with proper heading hierarchy */}
            <header>
              <h2
                className="text-blue-500 text-[16px] sm:text-[18px] lg:text-[20px] font-medium tracking-[-0.02em]"
                itemProp="name"
              >
                {caseStudy.title}
              </h2>

              <h3
                className="text-[24px] sm:text-[26px] lg:text-[48px] font-bold text-gray-600 max-w-xl sm:max-w-2xl sm:max-w-sm leading-[1.2]"
                style={{ color: caseStudy.color }}
                itemProp="alternativeHeadline"
              >
                {caseStudy.subtitle}
              </h3>
            </header>

            {/* Description with proper semantic markup */}
            <div 
              className="text-[16px] sm:text-[24px] text-gray-400 line-clamp-4 overflow-hidden leading-[1.2]"
              itemProp="description"
            >
              <p>{caseStudy.description}</p>
            </div>

            <div className="lg:flex-1">
              <CaseStudyTags
                theme={caseStudy.theme}
                tags={caseStudy.tags as string[]}
              />
            </div>

            {/* Desktop/Tablet CTA Button */}
            <div className="mt-auto">
              <Button
                size="sm"
                href={caseStudyUrl}
                aria-label={`View ${caseStudy.title} case study details`}
                className="group"
              >
                {ctaText}
                <ArrowUpRight className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Images Grid with semantic markup */}
          <div 
            className="w-full aspect-[6/3] sm:h-full sm:w-full"
            role="img"
            aria-label={`${caseStudy.title} preview image`}
          >
            {caseStudy.images
              .slice(0, 1)
              .map((image: ImageType, index: number) => (
                <CaseStudyImage
                  key={image.url}
                  url={image.url}
                  alt={image.alt}
                  isFirst={index === 0}
                />
              ))}
          </div>
        </Link>

        {/* Add metadata */}
        <meta itemProp="datePublished" content={new Date(caseStudy.createdAt).toString()} />
        <meta itemProp="author" content="ZIRO " />
        <meta itemProp="publisher" content="ZIRO " />
      </article>

      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd) }}
      />
    </>
  )
})

CaseStudyCard.displayName = 'CaseStudyCard'

