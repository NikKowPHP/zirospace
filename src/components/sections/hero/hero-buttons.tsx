'use client'

import { Button } from '@/components/ui/button/button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function HeroButtons() {
  const t = useTranslations('navigation')
  
  const handleProcessScroll = () => {
    const element = document.getElementById('our-process')
    if (!element) return
    
    const offset = -100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset + offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
  
  return (
    <div 
      className="flex  gap-2   sm:gap-[16px] pt-[20px] sm:pt-[20px] w-full px-[20px] sm:w-auto sm:px-4 md:px-0"
      role="group"
      aria-label="Primary actions"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      {/* Learn More Button */}
      <Button
        variant="outline"
        size="lg"
        className="w-full py-[30px] px-[25px] sm:w-auto rounded-full sm:py-6 sm:px-10 h-[48px] sm:h-[56px] text-[15px] sm:text-[16px] border border-primary text-[#0066FF] hover:bg-[#0066FF]/5"
        onClick={handleProcessScroll}
        aria-label={t('learnMore')}
        title={t('learnMore')}
        data-action="view-process"
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
      >
        <span itemProp="name">{t('learnMore')}</span>
        <meta itemProp="position" content="1" />
      </Button>

      {/* Book Call Button */}
      <Link 
        href="https://calendly.com/ziro-nikhil/30min"
        target="_blank"
        rel="noopener noreferrer"
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
      >
        <Button
          size="lg"
          className="w-full py-[30px] px-[25px] sm:w-auto rounded-full sm:py-6 sm:px-10 h-[48px] sm:h-[56px] text-[15px] sm:text-[16px] bg-primary hover:bg-[#0066FF]/90 whitespace-nowrap"
          aria-label={`${t('bookCall')} - Opens in a new tab`}
          title={t('bookCall')}
          data-action="book-call"
          data-tracking="cta-button"
        >
          <span itemProp="name">{t('bookCall')}</span>
          <meta itemProp="position" content="2" />
        </Button>
      </Link>
    </div>
  )
}

