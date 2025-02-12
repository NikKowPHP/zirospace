import { Suspense } from 'react'

import { type Locale } from '@/i18n'
import {
  HeroSection,
  SubheroSection,
  OurProcess,
  OurServices,
  CaseStudies,
  WhyUs,
  Philosophy,
  Faq,
  StayInformed,
  FloatVideo,
} from '@/helpers/componentsLoad'
import TestimonialsSection from '@/components/sections/testimonials/testimonials.server'



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
      <div className="relative ">
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
          <TestimonialsSection locale={locale} />
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
