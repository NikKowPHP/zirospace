import { Suspense } from 'react'
import { HeroButtons } from '../hero/hero-buttons'
import { getTranslations } from 'next-intl/server'

export const OurProcess = async () => {
  const t = await getTranslations('processSection')

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          Loading...
        </div>
      }
    >
      <section
        className=""
        itemScope
        itemType="https://schema.org/WebPageElement"
      >
        <ProcessTitleSubtitle t={t} />
        <ProcessItemList t={t} />
      </section>
    </Suspense>
  )
}
const ProcessTitleSubtitle = ( t: any ) => {
  return (
    <>
      <h1
        className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-primary"
        itemProp="headline"
      >
        {t('title')}
        <br className="hidden sm:block" />
        <h3 className="text-[18px] sm:text-[20px] lg:text-[24px] text-gray-600 leading-relaxed max-w-xl sm:max-w-2xl px-4 sm:px-0">
          {t('subtitle')}
        </h3>
      </h1>
    </>
  )
}

const ProcessItem = () => {
  return (
    <div>
      {/* <h2>{t('title')}</h2> */}
      <div>
        <ul>
          <li>{/* <p>{t('list.item1')}</p> */}</li>
        </ul>
      </div>
    </div>
  )
}
const ProcessItemList = ( t: any ) => {
  return <div></div>
}
