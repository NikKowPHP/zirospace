import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getProcessItems, ProcessItem as ProcessItemType } from '@/lib/data/our-processes'
export const OurProcess = async () => {
  const t = await getTranslations('processSection')
  const processItems = getProcessItems()

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px] ">
          Loading...
        </div>
      }
    >
      <section
        className="border border-gray-700 py-[100px] "
        itemScope
        itemType="https://schema.org/WebPageElement"
      >
        <ProcessTitleSubtitle t={t} />
        <ProcessItemList t={t} processItems={processItems} />
      </section>
    </Suspense>
  )
}
const ProcessTitleSubtitle = ({ t }: { t: any }) => {
  return (
    <div className='mb-[36px] flex flex-col items-center justify-center '>
      <h1
        className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-primary mb-[16px]"
        itemProp="headline"
      >
        {t('title')}
       
      </h1>
      <h3 className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-600 leading-relaxed max-w-xl sm:max-w-2xl px-4 sm:px-0">
          {t('subtitle')}
        </h3>
    </div>
  )
}

const ProcessItem = ({ t, index, item }: { t: any; index: number; item: any }) => {
  return (
    <div key={index} className="p-[36px] rounded-xl border border-red-500 bg-gray-100 shadow-sm flex flex-col gap-[16px] ">
      <h4 className='text-[16px] leading-[1.2]'>0{index + 1}</h4>
      <h2 className="text-lg text-black">{t(`${item.title}`)}</h2>
      <div className=" text-gray-600">
        <ul className="flex flex-col gap-[16px]">
        {item.list.map((listItem: any, index: number) => (
          <li key={index} className="text-gray-600 list-disc ml-[16px]">{t(`${listItem}`)}</li>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-[20px] max-w-5xl justify-center mx-auto">
      {items.map((item: any, index: number) => (
        <ProcessItem t={t} index={index} item={item} key={index} />
      ))}
    </div>
  )
}