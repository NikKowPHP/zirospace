import { HeroButtons } from './hero-buttons'
import { getTranslations } from 'next-intl/server'

export const HeroSection = async () => {
  const t = await getTranslations('hero')

  return (
    <section
      className="flex flex-col border border-green-900  pt-[180px] sm:pt-[175px] sm:pb-[100px] space-y-6 sm:space-y-8"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
       <h1
        className="font-normal text-[64px] sm:text-[72px] lg:text-[64px] leading-[1.1] font-medium tracking-[-0.02em] mb-2"
        itemProp="headline"
      >
        {t('title1')}
        <br className="hidden sm:block" />
        <span className="sm:hidden"> </span>
        {t('title2')}
      </h1>
      <p className="text-[18px] sm:text-[20px] lg:text-[24px] text-gray-600 leading-relaxed  px-4 sm:px-0">
        {t('subtitle')}
      </p>
      <HeroButtons />
    </section>
  )
}
