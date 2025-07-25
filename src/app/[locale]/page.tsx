
// File: src/app/[locale]/page.tsx
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
  TestimonialsSection,
  BannerModalWrapper,
  ContactFormSection,
  TeamSection,
  AdvisorsSection,
} from '@/helpers/componentsLoad'
import { companyConfig } from '@/config/company'
import { siteUrl } from '@/config/constants'
import { VisibilityProvider } from '@/contexts/VisibilityContext' // Import Provider
import { VisibilityManager } from '@/components/visibility-manager' // Import Manager
interface HomePageProps {
  params: Promise<{ locale: Locale }>
}

// Centralize JSON-LD data (remains the same)
const jsonLdData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${companyConfig.url}/#organization`,
    name: companyConfig.name,
    url: companyConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${companyConfig.url}/images/ziro.avif`,
      width: '180',
      height: '180',
    },
    sameAs: Object.values(companyConfig.social),
    description: companyConfig.description,
    areaServed: {
      '@type': 'Country',
      name: 'Poland',
    },
    knowsAbout: companyConfig.expertise,
  },
  service: {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: `${companyConfig.name} Services`,
    serviceType: companyConfig.services,
    audience: {
      '@type': 'Audience',
      audienceType: companyConfig.audience,
    },
  },
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: companyConfig.url,
      },
    ],
  },
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  return (
    // Wrap the relevant part of the page with VisibilityProvider
    <VisibilityProvider>
      <>
        <div
          className="relative min-h-screen  bg-white"
          itemScope
          itemType="https://schema.org/WebPage"
        >
          {/* Priority Content for LCP */}
          <HeroSection key={locale} locale={locale} />

          {/* Wrap the sections that need visibility management */}
          <VisibilityManager targetSectionId="our-process">
            {/* Deferred Content */}
            <div className="relative">
              <Suspense fallback={<div className="min-h-[300px]" />}>
                <SubheroSection />
              </Suspense>

              {/* Group related sections */}
              <Suspense fallback={<div className="min-h-[700px]" />}>
                <div>
                  {/* OurProcess is now rendered inside VisibilityManager */}
                  <OurProcess />
                  <OurServices />
                </div>
              </Suspense>

              <Suspense fallback={<div className="min-h-[300px]" />}>
                <CaseStudies locale={locale} />
              </Suspense>

              {/* Defer less critical sections */}
              <Suspense fallback={<div className="min-h-[300px]" />}>
                <TestimonialsSection locale={locale} />
              </Suspense>

              {/* Group remaining sections */}
              <Suspense fallback={<div className="min-h-[900px]" />}>
                <div>
                  <WhyUs />
                  <Philosophy />
                  <Faq />
                  <ContactFormSection />
                  <TeamSection />
                  <AdvisorsSection locale={locale} />
                  {/* <StayInformed /> */}
                </div>
              </Suspense>

              <Suspense fallback={null}>
                <BannerModalWrapper />
              </Suspense>
            </div>
          </VisibilityManager>

          {/* Metadata */}
          <meta itemProp="name" content={companyConfig.name} />
          <meta itemProp="description" content={companyConfig.description} />
          <meta itemProp="image" content="/images/ziro.avif" />
          <meta
            itemProp="dateModified"
            content={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Structured Data */}
        {Object.values(jsonLdData).map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
      </>
    </VisibilityProvider>
  )
}

// generateMetadata function remains the same
export async function generateMetadata({
  params,
}: {
  params: { locale: Locale }
}) {
  const { locale } = params

  return {
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        'en-US': '/en',
        'pl-PL': '/pl',
      },
    },
    title: {
      default:
        locale === 'en'
          ? 'ZIRO | Digital Health Solutions & Development'
          : 'ZIRO | Rozwiązania Cyfrowe dla Służby Zdrowia',
      template: '%s | ZIRO Healthcare Technology',
    },
    description:
      locale === 'en'
        ? 'Transforming healthcare through innovative digital solutions. We specialize in medical software development, health tech UI/UX, and patient-centric digital products.'
        : 'Transformacja ochrony zdrowia poprzez innowacyjne rozwiązania cyfrowe. Specjalizujemy się w tworzeniu oprogramowania medycznego, projektowaniu UI/UX dla sektora zdrowia i rozwiązaniach zorientowanych na pacjenta.',
    keywords:
      locale === 'en'
        ? [
            'digital health solutions',
            'healthcare software development',
            'medical app design',
            'health tech UI/UX',
            'patient experience design',
            'clinical workflow solutions',
            'healthcare technology',
            'medical software systems',
          ]
        : [
            'rozwiązania cyfrowe dla zdrowia',
            'rozwój oprogramowania medycznego',
            'projektowanie aplikacji medycznych',
            'technologia medyczna',
            'doświadczenie pacjenta',
            'systemy dla służby zdrowia',
            'informatyka medyczna',
            'rozwiązania dla klinik',
          ],
  }
}
// --- NEW CODE END ---