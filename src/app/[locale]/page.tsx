import { Suspense } from 'react'

import dynamic from 'next/dynamic'
import { type Locale } from '@/i18n'

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

interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  return (
    <div
      className="relative overflow-hidden min-h-screen bg-white"
      itemScope
      itemType="https://schema.org/WebSite"
    >
      <meta itemProp="name" content="ZIRO Agency" />
      <meta
        itemProp="description"
        content="Professional Web Design & Development Services"
      />
      <div className="container relative mx-auto md:px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[200px]">
              Loading...
            </div>
          }
        >
          <HeroSection />
        </Suspense>

        <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <SubheroSection />
        </Suspense>

        <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <OurProcess />
        </Suspense>

        <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <OurServices />
        </Suspense>
        <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <Testimonials />
        </Suspense>

        <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <CaseStudies locale={locale} />
        </Suspense>

        <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <WhyUs />
        </Suspense>

        <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <Philosophy />
        </Suspense>

        <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <Faq />
        </Suspense>

        <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <StayInformed />
        </Suspense>

        <Suspense
          fallback={
            <div className="" />
          }
        >
          <FloatVideo />
        </Suspense>
      </div>
    </div>
  )
}
