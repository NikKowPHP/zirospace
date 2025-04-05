import { getHeroSectionAction } from '@/infrastructure/services/pageServerActions'
import { HeroButtons } from './hero-buttons'

export const HeroSection = async ({ locale }: { locale: string }) => {
  const heroData = await getHeroSectionAction(locale)

  return (
    <section
      className="w-screen max-w-[100vw] -mx-4 sm:-mx-6 lg:-mx-8 flex flex-col justify-center items-center pt-[180px] sm:pt-[175px] sm:pb-[100px] space-y-6 sm:space-y-8 min-h-screen"
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
        className=" text-[64px] sm:text-[72px] lg:text-[64px] leading-[1.1] font-medium tracking-[-0.02em] mb-2 text-center max-w-[650px] mx-auto"
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
        className="text-[18px] sm:text-[20px] lg:text-[24px] text-gray-600 leading-relaxed px-4 sm:px-0 max-w-[800px] mx-auto text-center"
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
