import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

export const SubheroSection = async () => {
  const t = await getTranslations('subHeroSection')

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          Loading...
        </div>
      }
    >
      <section className="flex flex-col  items-center text-center py-[100px]  sm:py-[100px]"
        itemScope
        itemType="https://schema.org/WebPageElement"
      >
        <div className='flex flex-col items-center text-center max-w-6xl gap-[20px] sm:gap-[32px]'>

        <h1 className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-black"
          itemProp="headline"
        >
          {t('title')}
         
        </h1>
        <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-700 leading-relaxed  sm:px-0">
          {t('subtitle')}
        </p>

        </div>
      </section>
    </Suspense>

  )
}
