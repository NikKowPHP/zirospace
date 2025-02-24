import dynamic from 'next/dynamic'


export const HeroSection = dynamic(
  () =>
    import('@/components/sections/hero/hero').then((mod) => mod.HeroSection),
  {
    ssr: true,
  }
)

export const SubheroSection = dynamic(
  () =>
    import('@/components/sections/subhero/subhero').then(
      (mod) => mod.SubheroSection
    ),
  {
    ssr: true,
  }
)
export const OurProcess = dynamic(
  () =>
    import('@/components/sections/our-process/our-process').then(
      (mod) => mod.OurProcess
    ),
  {
    ssr: true,
  }
)

export const OurServices = dynamic(
  () =>
    import('@/components/sections/our-services/our-services').then(
      (mod) => mod.OurServices
    ),
  {
    ssr: true,
  }
)

export const WhyUs = dynamic(
  () => import('@/components/sections/why-us/why-us').then((mod) => mod.WhyUs),
  {
    ssr: true,
  }
)

export const Philosophy = dynamic(
  () =>
    import('@/components/sections/philosophy/philosophy').then(
      (mod) => mod.Philosophy
    ),
  {
    ssr: true,
  }
)

export const StayInformed = dynamic(
  () =>
    import('@/components/sections/stay-informed/stay-informed').then(
      (mod) => mod.StayInformed
    ),
  {
    ssr: true,
  }
)

export const Faq = dynamic(
  () => import('@/components/sections/faq/faq').then((mod) => mod.Faq),
  {
    loading: () => (
      <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
    ),
    ssr: true,
  }
)

export const Testimonials = dynamic(
  () =>
    import('@/components/sections/testimonials/testimonials').then(
      (mod) => mod.Testimonials
    ),
  {
    loading: () => <div className="min-h-[300px]" />,
    ssr: true,
  }
)

// Dynamic imports with loading boundaries
export const CaseStudies = dynamic(
  () =>
    import('@/components/sections/case-studies/case-studies').then(
      (mod) => mod.CaseStudies
    ),
  {
    loading: () => (
      <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
    ),
    ssr: true,
  }
)

export  const FloatVideo = dynamic(
  () => import('@/components/sections/float-video/float-video').then(mod => mod.FloatVideo),
  {
    ssr: true,
  }
)

export const BannerModalWrapper = dynamic(
  () => import('@/components/BannerModalWrapper').then((mod) => mod.BannerModalWrapper),
  {
    ssr: false,
  }
)

export const TestimonialsSection = dynamic(
  () => import('@/components/sections/testimonials/testimonials.server'),
  {
    ssr: true,
  }
)

