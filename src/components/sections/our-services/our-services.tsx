import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getServiceItems,  ServiceItem as ServiceItemType } from '@/lib/data/our-services'
export const OurServices = async () => {
  const t = await getTranslations('servicesSection')
  const serviceItems = getServiceItems()

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px] ">
          Loading...
        </div>
      }
    >
      <section
      id='our-services'
        className=" py-[100px] "
        itemScope
        itemType="https://schema.org/WebPageElement"
      >
        <ServiceTitleSubtitle t={t} />
        <ServiceItemList t={t} serviceItems={serviceItems} />
      </section>
    </Suspense>
  )
}
const ServiceTitleSubtitle = ({ t }: { t: any }) => {
  return (
    <div className='mb-[36px] flex flex-col items-center justify-center '>
      <h1
        className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-primary mb-[16px]"
        itemProp="headline"
      >
        {t('ourServicesTitle')}
       
      </h1>
      <h3 className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-600 leading-relaxed max-w-xl sm:max-w-2xl px-4 sm:px-0">
          {t('ourServicesSubtitle')}
        </h3>
    </div>
  )
}

const ServiceItemList = async ({
  t,
  serviceItems,
}: {
  t: any
  serviceItems: Promise<ServiceItemType[]>
}) => {
  const items = await serviceItems
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] sm:gap-[20px] justify-center mx-auto max-w-5xl">
      {items.map((item: ServiceItemType, index: number) => (
        <ServiceItem t={t} index={index} item={item} key={index} />
      ))}
    </div>
  )
}

const ServiceItem = ({ t, index, item }: { t: any; index: number; item: any }) => {
  return (
    <div key={index} className="p-[36px] rounded-xl  bg-gray-100 shadow-sm flex flex-col gap-[16px] ">
      <h4 className='text-[18px] leading-[1.2]'>{t(`${item.subtitle}`)}</h4>
      <h2 className="text-[48px] leading-[1.2] text-black">{t(`${item.title}`)}</h2>
      <p className=" text-[18px] text-gray-600">
        {t(`${item.description}`)}

      </p>
    </div>
  )
}
