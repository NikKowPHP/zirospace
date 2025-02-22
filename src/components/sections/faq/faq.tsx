'use client'

import { useState } from 'react'
import { faqItems } from '@/lib/data/faq'
import { cn } from '@/lib/utils/cn'
import { useTranslations } from 'next-intl'

interface FaqAccordionProps {
  itemId: string
  isOpen: boolean
  onToggle: () => void
}

function FaqAccordion({ itemId, isOpen, onToggle }: FaqAccordionProps) {
  const t = useTranslations('faq.items')

  return (
    <div
      className={cn(
        ' rounded-[50px] bg-gray-100 ',
        // isOpen ? 'rounded-3xl' : ''
      )}
      itemScope
      itemType="https://schema.org/Question"
    >
      <button
        className="flex w-full items-center justify-between py-6 text-left px-10"
        onClick={onToggle}
      >
        <span className="text-base sm:text-lg lg:text-xl font-medium">
          {t(`${itemId}.question`)}
        </span>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <MinusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </span>
      </button>
      <div
        className={cn(
          'grid overflow-hidden  duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] ' : 'grid-rows-[0fr] '
        )}
      >
        <div className="overflow-hidden"
        
          itemScope
          itemProp="acceptedAnswer"
          itemType="https://schema.org/Answer"
        >
          <p
            itemProp="text"
            className="text-gray-600 text-sm sm:text-base pb-6 px-10"
          >
            {t(`${itemId}.answer`)}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(null)
  const t = useTranslations('faq')

  return (
    <section
      id='faqs'
      className="py-12 md:container sm:py-16 mt-10 lg:py-24 lg:mb-10"
       itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="px-4 sm:px-0 ">
        <h2 className="text-center text-black text-[36px] sm:text-[46px] lg:text-[56px] font-medium mb-8 sm:mb-12 lg:mb-16" itemProp="name">
          {t('title')}
        </h2>
        <div 
          className="mx-auto flex flex-col gap-[12px] text-black"
          itemProp="mainEntity"
        >
          {faqItems.map((item) => (
                <FaqAccordion
                  itemId={item.id}
                  isOpen={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                />
          ))}
        </div>
      </div>
    </section>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v12m6-6H6"
      />
    </svg>
  )
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 12H6"
      />
    </svg>
  )
}
