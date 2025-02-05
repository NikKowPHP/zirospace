import { Suspense } from 'react'

import { HeroButtons } from '@/components/sections/hero/hero-buttons'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'
import { type Locale } from '@/i18n'
import { homePageMetadata } from '@/utils/metadata'


const SubheroSection = dynamic(
  () => import('@/components/sections/subhero/subhero').then(mod => mod.SubheroSection),
  {
    ssr: true
  }
)
const OurProcess = dynamic(
  () => import('@/components/sections/our-process/our-process').then(mod => mod.OurProcess),
  {
    ssr: true
  }
)

const OurServices = dynamic(
  () => import('@/components/sections/our-services/our-services').then(mod => mod.OurServices),
  {
    ssr: true
  }
)
const HeroSection = dynamic(
  () => import('@/components/sections/HeroSection').then(mod => mod.HeroSection),
  {
    ssr: true
  }
)


const Faq = dynamic(
  () => import('@/components/sections/faq/faq').then(mod => mod.Faq),
  {
    loading: () => <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />,
    ssr: true
  }
)


const Testimonials = dynamic(
  () => import('@/components/sections/testimonials/testimonials').then(mod => mod.Testimonials),
  {
    loading: () => <div className="min-h-[300px]" />,
    ssr: true
  }
)

// Dynamic imports with loading boundaries
const CaseStudies = dynamic(
  () => import('@/components/sections/case-studies/case-studies').then(mod => mod.CaseStudies),
  {
    loading: () => <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />,
    ssr: true
  }
)




interface HomePageProps {
  params: Promise<{ locale: Locale }>
}


export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const t = await getTranslations('hero')

  return (
    <div
      className="relative overflow-hidden min-h-screen bg-white"
      itemScope
      itemType="https://schema.org/WebSite"
    >
      <meta itemProp="name" content="ZIRO Agency" />
      <meta itemProp="description" content="Professional Web Design & Development Services" />
      <div className="container relative mx-auto md:px-4 sm:px-6 lg:px-8">
      
        <HeroSection locale={locale} />

        <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <CaseStudies locale={locale} />
        </Suspense>

        {/* <div className="md:container py-12 sm:py-16 lg:py-20">
          <RunningTags services={services} />
        </div> */}

        {/* <Suspense
          fallback={
            <div className="min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <Pricing />
        </Suspense> */}

        {/* <Suspense
          fallback={
            <div className="md:container min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]" />
          }
        >
          <Team />
        </Suspense> */}

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
          <Faq />
        </Suspense>




      </div>
    </div>
  )
}