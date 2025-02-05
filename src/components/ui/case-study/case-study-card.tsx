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

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  locale: Locale
}

// Separate image component for better performance
const CaseStudyImage = memo(function CaseStudyImage({ 
  url, 
  alt, 
  isFirst 
}: { 
  url: string
  alt: string
  isFirst: boolean 
}) {
  return (
    <div
      className={cn(
        'relative rounded-primary sm:rounded-[18px]  overflow-hidden',
        isFirst ? 'col-span-2 row-span-2' : ''
      )}
    >
      <Image
        src={url}
        alt={alt}
        loading={isFirst ? "eager" : "lazy"}
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
const CaseStudyTags = memo(function CaseStudyTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {tags.map((tag) => (
        <Tag 
          key={tag} 
          variant="primary" 
          className="px-8 text-sm sm:text-base"
        >
          {tag}
        </Tag>
      ))}
    </div>
  )
})

// Main component with performance optimizations
export const CaseStudyCard = memo(function CaseStudyCard({ 
  caseStudy,
  locale
}: CaseStudyCardProps) {
  const t = useTranslations()
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      console.log(isIOS)
      if (isIOS) {
        setIsIOS(true)
      }
  }, []);
  
  // Use a default translation key if the custom one fails
  const ctaText = () => {
    try {
      return t(caseStudy.ctaTextName)
    } catch (error) {
      console.error(error)
      return t('caseStudy.ctaText.viewCaseStudy')
    }
  }

  return (
    <article 
      className="flex flex-col rounded-[24px] sm:rounded-[32px] border border-gray-200 p-6 sm:p-8 lg:p-10 shadow-sm h-full"
      itemScope
      itemType="https://schema.org/CreativeWork"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-[50px]  h-full p-2 sm:p-10 lg:p-2">
        <div className="flex flex-col  sm:space-y-8 h-full">
          <div className="">
            {/* Title */}
            <h2 
              className="text-[32px] sm:text-[40px] lg:text-[48px] font-medium tracking-[-0.02em] text-gray-900 mb-6 sm:mb-8"
              itemProp="name"
            >
              {caseStudy.title}
            </h2>
            
            {/* Description */}
            <p 
              className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed lg:mb-8 sm:mb-[20px] line-clamp-4 overflow-hidden"
              itemProp="description"
            >
              {caseStudy.description}
            </p>
            
          </div>

          <div className='lg:flex-1'>

            {/* Tags */}
            <CaseStudyTags tags={caseStudy.tags as string[]} />
            
            <meta itemProp="keywords" content={caseStudy.tags.join(', ')} />
          </div>
          
          {/* Desktop/Tablet CTA Button */}
          <div className="hidden lg:block mt-auto">
            <Button 
              size="xl" 
              href={`/${locale}/case-studies/${caseStudy.slug}`}
            >
              {ctaText()}
            </Button>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 auto-rows-[150px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
          {caseStudy.images.slice(0, 1).map((image: ImageType, index: number) => (
            <CaseStudyImage
              key={image.url}
              url={image.url}
              alt={image.alt}
              isFirst={index === 0}
            />
          ))}
        </div>
          {/* Mobile CTA Button */}
      <div className={cn("lg:hidden lg:pt-10 sm:py-4 md:px-[20px] sm:px-[20px] sm:pb-10", isIOS ? 'pb-[40px]' : '')}>
        <Button 
          size="xl" 
          href={`/${locale}/case-studies/${caseStudy.slug}`}
          className="w-full"
        >
          {ctaText()}
        </Button>
      </div>
      </div>

    
    </article>
  )
})

// Add display name for better debugging
CaseStudyCard.displayName = 'CaseStudyCard'
