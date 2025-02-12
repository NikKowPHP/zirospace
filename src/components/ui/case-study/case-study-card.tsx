'use client'

import { memo, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button/button'
import { Tag } from '@/components/ui/tag/tag'
import { cn } from '@/lib/utils/cn'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { type Image as ImageType } from '@/domain/models/case-study.model'
import { type CaseStudy } from '@/domain/models/case-study.model'
import { Locale } from '@/i18n'
import { ArrowBigRightIcon, ArrowUpRight } from 'lucide-react'

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  locale: Locale
}

// Separate image component for better performance
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
        'relative h-full w-full rounded-b-[24px] sm:rounded-primary sm:rounded-[18px] overflow-hidden',
        isFirst ? 'col-span-2 row-span-2' : ''
      )}
    >
      <Image
        src={url}
        alt={alt}
        loading={isFirst ? 'eager' : 'lazy'}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={isFirst}
        quality={isFirst ? 100 : 75}
      />
    </div>
  )
})

// Separate tags component to prevent unnecessary re-renders
const CaseStudyTags = memo(function CaseStudyTags({
  tags,
  theme,
}: {
  tags: string[]
  theme: string
}) {
  return (
    <div className="flex flex-wrap  ">
      {tags.map((tag, index) => (
        <div key={tag} className="flex items-center ">
          <span key={tag}>
            <Tag
              variant={theme === 'dark' ? 'dark' : 'primary'}
              className="px-8 text-sm sm:text-base"
            >
              {tag}
            </Tag>
          </span>

          {index !== tags.length - 1 && (
            <span
              className=" select-none mx-1 text-[10px] text-blue-500"
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

// Main component with performance optimizations
export const CaseStudyCard = memo(function CaseStudyCard({
  caseStudy,
  locale,
}: CaseStudyCardProps) {
  const t = useTranslations()
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    console.log(isIOS)
    if (isIOS) {
      setIsIOS(true)
    }
  }, [])

  // Use a default translation key if the custom one fails
  const ctaText = () => {
    return t('caseStudy.ctaText.viewCaseStudy')
  }

  return (
    <article
      className={`flex flex-col  rounded-[24px] sm:rounded-[32px] border border-gray-200 shadow-sm h-full`}
      style={{
        color: caseStudy.color,
        backgroundColor: caseStudy.backgroundColor,
      }}
      itemScope
      itemType="https://schema.org/CreativeWork"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8    h-full">
        <div className="flex flex-col   h-full p-[20px] sm:p-[40px] gap-[20px]">
          {/* Title */}
          <h2
            className=" text-blue-500 text-[16px] sm:text-[18px] lg:text-[20px] font-medium tracking-[-0.02em] "
            itemProp="name"
          >
            {caseStudy.title}
          </h2>

          {/* Subtitle */}
          <h3
            className="text-[24px] sm:text-[26px] lg:text-[48px] font-bold text-gray-600 max-w-xl sm:max-w-2xl  sm:max-w-sm leading-[1.2] "
            style={{
              color: caseStudy.color,
            }}
            itemProp="name"
          >
            {caseStudy.subtitle}
          </h3>

          {/* Description */}
          <p
            className="text-[16px]  sm:text-[24px] text-gray-400  line-clamp-4 overflow-hidden leading-[1.2] "
            itemProp="description"
          >
            {caseStudy.description}
          </p>

          <div className="lg:flex-1">
            {/* Tags */}
            <CaseStudyTags
              theme={caseStudy.theme}
              tags={caseStudy.tags as string[]}
            />

            <meta itemProp="keywords" content={caseStudy.tags.join(', ')} />
          </div>

          {/* Desktop/Tablet CTA Button */}
          <div className=" mt-auto ">
            <Button
              size="sm"
              href={`/${locale}/case-studies/${caseStudy.slug}`}
            >
              {ctaText()}
              <ArrowUpRight className="" />
            </Button>
          </div>
        </div>

        {/* Images Grid */}
        <div className="w-full aspect-[6/3] sm:h-full sm:w-full   ">
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
        {/* Mobile CTA Button */}
        {/* <div
          className={cn(
            'lg:hidden lg:pt-10 sm:py-4 md:px-[20px] sm:px-[20px] sm:pb-10',
            isIOS ? 'pb-[40px]' : ''
          )}
        >
          <Button
            size="xl"
            href={`/${locale}/case-studies/${caseStudy.slug}`}
            className="w-full"
          >
            {ctaText()}
          </Button>
        </div> */}
      </div>
    </article>
  )
})

// Add display name for better debugging
CaseStudyCard.displayName = 'CaseStudyCard'
