'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { footerConfig } from '@/config/footer'
import { usePathname, useRouter } from 'next/navigation'
import { siteUrl } from '@/config/constants';
export function Footer() {
  const t = useTranslations('footer')
  const pathname = usePathname()
  const router = useRouter()

  // Helper function to scroll to an element by id
  const scrollElement = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  // Handler for footer links
  const handleFooterLink = (item: { title: string; href: string }) => {
    // If the current page is not the homepage, redirect first
    if (pathname !== '/') {
      router.push('/')
      // Delay scrolling to allow the homepage sections to render
      setTimeout(() => {
        scrollElement(item.href)
      }, 100)
    } else {
      scrollElement(item.href)
    }
  }

  // Organization JSON-LD
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    "name": "ZIRO Healthcare Solutions",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/images/ziro.avif`,
      "width": "100",
      "height": "34"
    },
    "description": "Digital health solutions provider specializing in medical software development and healthcare technology innovation.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Poland"
    },
    "sameAs": [
      "https://twitter.com/ziro",
      "https://linkedin.com/company/ziros",
      "https://www.instagram.com/ziro.space/",
      "https://www.nikhil.health/",
      "https://x.com/NikhilSing69944",
    ],
    "knowsAbout": [
      "Healthcare Software Development",
      "Medical Technology",
      "Digital Health Solutions",
      "Patient Experience Design",
      "Clinical Workflow Optimization"
    ]
  }

  return (
    <>
      <footer
        className="bg-gray-50 w-full rounded-primary-lg py-12 px-2 sm:py-18 sm:px-20"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Company Info Column */}
            <div className="lg:col-span-6 space-y-6">
              <Link 
                href="/"
                className="inline-block"
                itemProp="url"
              >
                <Image
                  src="/images/ziro.avif"
                  alt="ZIRO Healthcare Solutions"
                  width={100}
                  height={34}
                  className="h-[34px] w-auto"
                  itemProp="logo"
                  priority
                />
              </Link>

              {/* Location Indicator */}
              <div className="flex items-center gap-2">
                <Image
                  src="/images/pl.svg"
                  alt="Located in Poland"
                  width={24}
                  height={16}
                  className="w-6 h-[20px]"
                />
                <span className="text-sm text-gray-600">
                  {t('designedWith')}
                </span>
              </div>

              {/* Company Description */}
              <div className="space-y-4">
                <p 
                  className="text-gray-600 text-sm max-w-md"
                  itemProp="description"
                >
                  {t('description')}
                </p>
                <p className="text-sm text-gray-500">
                  <span itemProp="name">ZIRO</span>
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <Link
                  href="mailto:contact@ziro.space"
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                  itemProp="email"
                >
                  nikhil@ziro.space
                </Link>
              </div>
            </div>

            {/* Navigation Links */}
            <nav 
              className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-2  gap-12 mt-12 "
              aria-label="Footer Navigation"
            >
              {/* Main Navigation */}
              <div className="flex flex-col gap-4 justify-start  items-start">
                {/* <h2 className="font-medium text-gray-900 text-sm mb-2">
                  {t('navigation.')}
                </h2> */}
                {footerConfig.mainNav.map((item, index) => (
                  <button
                    key={index}
                    className="text-gray-600 text-[14px] hover:text-primary transition-colors"
                    onClick={() => handleFooterLink(item)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex flex-col gap-4">
                <h2 className="font-medium text-gray-900 text-sm mb-2">
                  {t('connect')}
                </h2>
                {footerConfig.socialLinks.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-gray-600 text-[14px] hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} ZIRO sp. z o.o. {t('rights')}
            </p>
          </div>

          {/* Hidden SEO Metadata */}
          <meta itemProp="foundingDate" content="2023" />
          <meta itemProp="url" content={siteUrl} />
          <meta itemProp="industry" content="Healthcare Technology" />
          <meta itemProp="keywords" content="digital health solutions, healthcare software development, medical app design, health tech UI/UX, patient experience design" />
        </div>
      </footer>

      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
    </>
  )
}
