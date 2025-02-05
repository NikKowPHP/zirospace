import { Suspense } from 'react'
import { HeroButtons } from '../hero/hero-buttons'
import { getTranslations } from 'next-intl/server'

export const OurProcess = async ({ locale }: { locale: string }) => {
  const t = await getTranslations('hero')

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          Loading...
        </div>
      }
    >
      <section className="flex flex-col items-center text-center pt-[180px] sm:pt-[180px] lg:pt-[160px] pb-[60px] sm:pb-[80px] lg:pb-[100px] space-y-6 sm:space-y-8"
        itemScope
        itemType="https://schema.org/WebPageElement"
      >
        <h1 className="text-[40px] sm:text-[56px] lg:text-[80px] leading-[1.1] font-medium tracking-[-0.02em] text-primary"
          itemProp="headline"
        >
          {t('title1')}
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          {t('title2')}
        </h1>
        <p className="text-[18px] sm:text-[20px] lg:text-[24px] text-gray-900 leading-relaxed max-w-xl sm:max-w-2xl px-4 sm:px-0">
          {t('subtitle')}
        </p>
        <HeroButtons />
      </section>
    </Suspense>

  )
}
