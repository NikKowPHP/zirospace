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
  TestimonialsSection
} from '@/helpers/componentsLoad'

interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

const healthcareJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://ziro.space/#organization",
  "name": "ZIRO Healthcare Solutions",
  "url": "https://ziro.space",
  "logo": {
    "@type": "ImageObject",
    "url": "https://ziro.space/images/ziro.avif",
    "width": "180",
    "height": "180"
  },
  "sameAs": [
    "https://twitter.com/ziroagency",
    "https://linkedin.com/company/ziroagency"
  ],
  "description": "Digital health solutions provider specializing in medical software development and healthcare technology innovation.",
  "areaServed": {
    "@type": "Country",
    "name": "Poland"
  },
  "knowsAbout": [
    "Healthcare Software Development",
    "Medical Technology",
    "Digital Health Solutions",
    "Patient Experience Design",
    "Clinical Workflow Optimization"
  ]
}

const healthcareServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "ZIRO Healthcare Technology Services",
  "serviceType": [
    "Healthcare Software Development",
    "Medical UX/UI Design",
    "Digital Health Solutions",
    "Clinical Workflow Systems"
  ],
  "audience": {
    "@type": "Audience",
    "audienceType": [
      "Healthcare Providers",
      "Medical Clinics",
      "Hospitals",
      "Healthcare Professionals"
    ]
  }
}

// Breadcrumb JSON-LD
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://ziro.space"
  }]
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(healthcareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(healthcareServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div
        className="relative overflow-hidden min-h-screen bg-white"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <meta itemProp="name" content="ZIRO Healthcare Technology Solutions" />
        <meta
          itemProp="description"
          content="Innovative digital health solutions and medical software development for modern healthcare providers."
        />
        <meta
          itemProp="keywords"
          content="healthcare technology, medical software, digital health solutions, patient experience design, clinical workflow systems, healthcare UX/UI, medical app development"
        />
        <meta itemProp="image" content="/images/ziro.avif" />
        <meta itemProp="datePublished" content="2024-01-01" />
        <meta itemProp="dateModified" content={new Date().toISOString().split('T')[0]} />
        <meta itemProp="author" content="ZIRO Healthcare Solutions" />
        <meta itemProp="inLanguage" content={locale} />

        <div className="relative">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[200px]">
                <span className="sr-only">Loading healthcare solutions...</span>
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
    </>
  )
}
