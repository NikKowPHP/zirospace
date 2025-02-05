import dynamic from 'next/dynamic'


const HeroSection = dynamic(
  () =>
    import('@/components/sections/hero/hero').then((mod) => mod.HeroSection),
  {
    ssr: true,
  }
)

const SubheroSection = dynamic(
  () =>
    import('@/components/sections/subhero/subhero').then(
      (mod) => mod.SubheroSection
    ),
  {
    ssr: true,
  }
)
const OurProcess = dynamic(
  () =>
    import('@/components/sections/our-process/our-process').then(
      (mod) => mod.OurProcess
    ),
  {
    ssr: true,
  }
)

const OurServices = dynamic(
  () =>
    import('@/components/sections/our-services/our-services').then(
      (mod) => mod.OurServices
    ),
  {
    ssr: true,
  }
)

const WhyUs = dynamic(
  () => import('@/components/sections/why-us/why-us').then((mod) => mod.WhyUs),
  {
    ssr: true,
  }
)

const Philosophy = dynamic(
  () =>
    import('@/components/sections/philosophy/philosophy').then(
      (mod) => mod.Philosophy
    ),
  {
    ssr: true,
  }
)

const StayInformed = dynamic(
  () =>
    import('@/components/sections/stay-informed/stay-informed').then(
      (mod) => mod.StayInformed
    ),
  {
    ssr: true,
  }
)

const Faq = dynamic(
  () => import('@/components/sections/faq/faq').then((mod) => mod.Faq),
  {
    loading: () => (
      <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
    ),
    ssr: true,
  }
)

const Testimonials = dynamic(
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
const CaseStudies = dynamic(
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

const FloatVideo = dynamic(
  () => import('@/components/sections/float-video/float-video').then(mod => mod.FloatVideo),
  {
    ssr: true,
  }
)