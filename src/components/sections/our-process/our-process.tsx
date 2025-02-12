import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getProcessItems, ProcessItem as ProcessItemType } from '@/lib/data/our-processes'

export const OurProcess = async () => {
  const t = await getTranslations('processSection')
  const processItems = getProcessItems()

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
          <ProcessItemList t={t} processItems={processItems} />
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

const ProcessItem = ({ t, index, item }: { t: any; index: number; item: ProcessItemType }) => {
  return (
    <div 
      className="p-[36px] rounded-xl bg-gray-100 shadow-sm flex flex-col gap-[16px]"
      itemProp="step"
      itemScope
      itemType="https://schema.org/HowToStep"
    >
      <meta itemProp="position" content={`${index + 1}`} />
      <span 
        className='text-[16px] leading-[1.2] text-primary'
        aria-hidden="true"
      >
        0{index + 1}
      </span>
      <h3 
        className="text-lg text-black"
        itemProp="name"
      >
        {t(`${item.title}`)}
      </h3>
      <div 
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <ul 
          className="flex flex-col gap-[16px]"
          role="list"
          aria-label={`Steps for ${t(`${item.title}`)}`}
        >
          {item.list.map((listItem: string, listIndex: number) => (
            <li 
              key={listIndex} 
              className="text-gray-600 list-disc ml-[16px]"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/HowToDirection"
            >
              <span itemProp="text">{t(`${listItem}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const ProcessItemList = async ({
  t,
  processItems,
}: {
  t: any
  processItems: Promise<ProcessItemType[]>
}) => {
  const items = await processItems
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] sm:gap-[20px] max-w-5xl justify-center mx-auto"
      role="list"
      aria-label="Development process steps"
    >
      {items.map((item: ProcessItemType, index: number) => (
        <ProcessItem 
          t={t} 
          index={index} 
          item={item} 
          key={index} 
        />
      ))}
    </div>
  )
}
