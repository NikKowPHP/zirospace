import { HeroButtons } from './hero-buttons'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'

export const HeroSection = async () => {
  // Obtain the current request headers.
  const headersList = headers()
  // Retrieve the 'accept-language' header; fallback to 'en-US' if not present.
  const acceptLanguage = headersList.get('accept-language') ?? 'en-US'
  // Extract the primary language from the header (e.g., "en-US" from "en-US,en;q=0.9,...")
  const primaryLanguage = acceptLanguage.split(',')[0]
  console.log('Primary Language:', primaryLanguage)

  // Fetch translations for the hero namespace.
  const [t] = await Promise.all([
    getTranslations('hero')
  ])

  return (
    <section
      className="flex flex-col justify-center items-center pt-[180px] sm:pt-[175px] sm:pb-[100px] space-y-6 sm:space-y-8"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      {/* Optimize heading for LCP */}
      <h1
        className="font-normal text-[64px] sm:text-[72px] lg:text-[64px] leading-[1.1] font-medium tracking-[-0.02em] mb-2 text-center max-w-[1200px] mx-auto"
        itemProp="headline"
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '64px',
        }}
      >
        <span className="inline-block">
          {t('title1')}
        </span>
        <br className="hidden sm:block" aria-hidden="true" />
        <span className="sm:hidden"> </span>
        <span className="inline-block">
          {t('title2')}
        </span>
      </h1>

      {/* Optimize subtitle */}
      <p 
        className="text-[18px] sm:text-[20px] lg:text-[24px] text-gray-600 leading-relaxed px-4 sm:px-0 max-w-[800px] mx-auto text-center"
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '24px',
        }}
      >
        {t('subtitle')}
      </p>

      {/* Defer buttons rendering */}
      <div className="opacity-0 animate-fadeIn">
        <HeroButtons />
      </div>
    </section>
  )
}
