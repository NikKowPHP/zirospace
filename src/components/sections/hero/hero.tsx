import { getHeroSectionAction } from '@/infrastructure/services/pageServerActions'
import { HeroButtons } from './hero-buttons'

export const HeroSection = async ({ locale }: { locale: string }) => {
  const heroData = await getHeroSectionAction(locale)

  return (
    <section
      className="md:w-screen md:max-w-[100vw]  sm:-mx-6 lg:-mx-8 flex flex-col justify-center items-center pt-[100px] sm:pt-[100px] sm:pb-[100px] space-y-6 sm:space-y-8 sm:min-h-screen px-4 sm:px-6"

      itemScope
      itemType="https://schema.org/WebPageElement"
      style={{
        backgroundImage: heroData?.background_image
          ? `url(${heroData.background_image})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Optimize heading for LCP */}
      <h1
        className="text-[64px] sm:text-[72px] lg:text-[64px] leading-[1.1] font-medium tracking-[-0.02em] mb-2 text-center max-w-[90vw] sm:max-w-[650px] mx-auto"
        itemProp="headline"
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '64px',
        }}
      >
        <span className="inline-block">{heroData?.title}</span>
      </h1>

      {/* Optimize subtitle */}
      <p
        className="text-[16px] sm:text-[20px] lg:text-[24px] text-gray-600 leading-relaxed px-2 sm:px-0 max-w-[90vw] sm:max-w-[800px] mx-auto text-center"
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '24px',
        }}
      >
        {heroData?.subtitle}
      </p>

      {/* Defer buttons rendering */}
      <div className="opacity-0 animate-fadeIn">
        <HeroButtons />
      </div>
    </section>
  )
}
