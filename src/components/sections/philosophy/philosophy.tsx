import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

export const Philosophy = async () => {
  const t = await getTranslations('ziroPhilosophy')

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          Loading...
        </div>
      }
    >
      <section
      id='philosophy'
        className="flex flex-col  items-center text-center   py-[100px] "
        itemScope
        itemType="https://schema.org/WebPageElement"
      >
        <div className="flex flex-col items-center text-center max-w-5xl gap-[10px] sm:gap-[12px]">
          <h1
            className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-black"
            itemProp="headline"
          >
            {t('title')}
          </h1>
          <h3 className="text-[18px] sm:text-[20px] lg:text-[20px] text-gray-700 leading-[1.2] sm:px-0">
            <span className="text-[#868788]">{t('subtitle')} </span>
            <span className="text-primary">"{t('idea')}"</span>
          </h3>
          <div className="flex flex-col gap-[20px] ">
            <p className="text-[18px] sm:text-[20px] lg:text-[20px] text-gray-700 leading-[1.2] sm:px-0 text-[#868788]">
              {t('description1')}
            </p>
            <p className="text-[18px] sm:text-[20px] lg:text-[20px] text-gray-700 leading-[1.2] sm:px-0 text-[#868788]">
              {t('description2')}
            </p>
          </div>
        </div>
      </section>
    </Suspense>
  )
}
