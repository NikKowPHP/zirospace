import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from 'react'
import { siteUrl } from '@/config/constants';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ZIRO | Digital Health Solutions & Development',
    template: '%s | ZIRO - Healthcare Technology Solutions'
  },
  description: 'Transforming healthcare through user-centric digital solutions. Specializing in medical software development, health tech UI/UX, and digital health product design.',
  icons: {
    icon: [
      {
        url: '/images/favicon.ico',
        sizes: 'any',
      }
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/apple-icon.png',
        color: '#000000',
      }
    ]
  },
  keywords: [
    'digital health solutions',
    'healthcare software development',
    'medical app design',
    'health tech UI/UX',
    'digital health products',
    'healthcare technology',
    'medical software solutions',
    'health app development',
    'patient experience design',
    'healthcare UX research'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'ZIRO',
    title: 'ZIRO - Digital Health Solutions & Development',
    description: 'Empowering healthcare through innovative digital solutions. We create user-centric medical software and health tech products that enhance patient care and clinical workflows.',
    images: [
      {
        url: '/images/ziro.avif',
        width: 1200,
        height: 630,
        alt: 'ZIRO Digital Health Solutions'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZIRO - Digital Health Solutions & Development',
    description: 'Creating innovative digital health solutions for better healthcare delivery and patient experience.',
    images: ['/images/ziro.avif']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthcareBusiness",
  "name": "ZIRO",
  "url": siteUrl,
  "logo": `/images/ziro.avif`,
  "description": "Digital health solutions provider specializing in medical software development and healthcare technology.",
  "sameAs": [
    "https://twitter.com/ziro",
    "https://linkedin.com/company/ziros",
    "https://www.instagram.com/ziro.space/",
    "https://www.nikhil.health/",
    "https://x.com/NikhilSing69944"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Poland"
  },
  "knowsAbout": [
    "Digital Health Solutions",
    "Healthcare Software Development",
    "Medical UX Design",
    "Health Technology",
    "Patient Experience Design"
  ],
  "serviceType": [
    "Healthcare Software Development",
    "Digital Health Product Design",
    "Medical UX/UI Design",
    "Health Tech Solutions"
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={`${siteUrl}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Suspense>
          {children}

        </Suspense>
        <Analytics mode="production" debug={false} />
      </body>
    </html>
  )
} 