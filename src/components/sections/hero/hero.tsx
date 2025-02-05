import { HeroButtons } from './hero-buttons'
import { getTranslations } from 'next-intl/server'

export const HeroSection = async () => {
  const t = await getTranslations('hero')

  return (
    <section
      className="flex flex-col border border-green-900  pt-[180px] sm:pt-[300px] pb-[60px] sm:pb-[150px]space-y-6 sm:space-y-8"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
       <h1
        className="font-normal text-[64px] sm:text-[72px] lg:text-[64px] leading-[1.1] font-medium tracking-[-0.02em]"
        itemProp="headline"
      >
        {t('title1')}
        <br className="hidden sm:block" />
        <span className="sm:hidden"> </span>
        {t('title2')}
      </h1>
      <p className="text-[18px] sm:text-[20px] lg:text-[24px] text-gray-600 leading-relaxed max-w-xl sm:max-w-3xl px-4 sm:px-0">
        {t('subtitle')}
      </p>
      <HeroButtons />
    </section>
  )
}
