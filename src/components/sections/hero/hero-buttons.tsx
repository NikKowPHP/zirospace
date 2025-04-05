'use client'

import { Button } from '@/components/ui/button/button'
import logger from '@/lib/logger'
import Link from 'next/link'

interface HeroButtonsProps {
  primaryText: string
  primaryLink: string
  secondaryText: string
  secondaryLink: string
}

export function HeroButtons({
  primaryText,
  primaryLink,
  secondaryText,
  secondaryLink,
}: HeroButtonsProps) {

  logger.log(primaryText, primaryLink, secondaryText, secondaryLink)
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
        aria-label={secondaryText}
        title={secondaryText}
        data-action="view-process"
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
      >
        <span itemProp="name">{secondaryText}</span>
        <meta itemProp="position" content="1" />
      </Button>

      {/* Book Call Button */}
      <Link 
        href={primaryLink}
        target="_blank"
        rel="noopener noreferrer"
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
      >
        <Button
          size="lg"
          className="w-full py-[30px] px-[25px] sm:w-auto rounded-full sm:py-6 sm:px-10 h-[48px] sm:h-[56px] text-[15px] sm:text-[16px] bg-primary hover:bg-[#0066FF]/90 whitespace-nowrap"
          aria-label={`${primaryText} - Opens in a new tab`}
          title={primaryText}
          data-action="book-call"
          data-tracking="cta-button"
        >
          <span itemProp="name">{primaryText}</span>
          <meta itemProp="position" content="2" />
        </Button>
      </Link>
    </div>
  )
}

