'use client'

import { Button } from '@/components/ui/button/button'
import { useTranslations } from 'next-intl'

export function HeroButtons() {
  const t = useTranslations('navigation')
  
  return (
    <div 
      className="flex flex-col sm:flex-row gap-[16px] pt-[36px] sm:pt-[36px] w-full px-[20px] sm:w-auto sm:px-4 md:px-0"
      role="group"
      aria-label="Hero actions"
    >
      <Button
        variant="outline"
        size="lg"
        className="w-full py-[30px] px-[25px] sm:w-auto rounded-full  sm:py-6 sm:px-10 h-[48px] sm:h-[56px] text-[15px] sm:text-[16px] border border-primary  text-[#0066FF] hover:bg-[#0066FF]/5"
        onClick={() => {
          const element = document.getElementById('pricing')
          const offset = -100
          const elementPosition = element?.getBoundingClientRect().top ?? 0
          const offsetPosition = elementPosition + window.pageYOffset + offset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }}
        aria-label="View our pricing plans"
      >
        {t('learnMore')}
      </Button>
      <Button
        size="lg"
        className="w-full py-[30px] px-[25px] sm:w-auto rounded-full  sm:py-6 sm:px-10 h-[48px] sm:h-[56px] text-[15px] sm:text-[16px] bg-primary hover:bg-[#0066FF]/90"
        onClick={() => {
          window.location.href = 'https://calendly.com/ziro-nikhil/30min'
        }}
      >
        {t('bookCall')}
      </Button>
    </div>
  )
}
