import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import {  ProcessItemListClient } from './our-process-list.client'
import { getProcessItems } from '@/lib/data/our-processes'

export const OurProcess = async () => {
  const t = await getTranslations('processSection')
  const processItems = await getProcessItems()


  const processItemsTranslated = processItems.map((item) => ({
    ...item,
    title: t(`${item.title}`),
    list: item.list.map((listItem) => t(`${listItem}`)),
    image: item.image
  }))
  // Create JSON-LD for the process section
  const processJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": t('title'),
    "description": t('subtitle'),
    "step": (await processItems).map((item, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": t(`${item.title}`),
      "itemListElement": item.list.map(listItem => ({
        "@type": "HowToDirection",
        "text": t(`${listItem}`)
      }))
    }))
  }

  return (
    <>
      <Suspense
        fallback={
          <div 
            className="flex items-center justify-center min-h-[200px]"
            aria-label="Loading process section"
          >
            Loading...
          </div>
        }
      >
        <section
          id="our-process"
          className="py-[100px]"
          itemScope
          itemType="https://schema.org/HowTo"
          aria-labelledby="process-title"
        >
          <ProcessTitleSubtitle t={t} />
          <ProcessItemListClient processItems={processItemsTranslated} />
        </section>
      </Suspense>

      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(processJsonLd) }}
      />
    </>
  )
}

const ProcessTitleSubtitle = ({ t }: { t: any }) => {
  return (
    <header className='mb-[36px] flex flex-col items-center justify-center text-center'>
      <h2
        id="process-title"
        className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-primary mb-[16px]"
        itemProp="name"
      >
        {t('title')}
      </h2>
      <p 
        className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-600 leading-relaxed max-w-xl sm:max-w-2xl px-4 sm:px-0"
        itemProp="description"
      >
        {t('subtitle')}
      </p>
    </header>
  )
}
