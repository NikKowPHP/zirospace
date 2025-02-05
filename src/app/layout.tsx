import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  metadataBase: new URL('https://ziro.agency'),
  title: {
    default: 'ZIRO | Web Design & Development Agency',
    template: '%s | ZIRO - Professional Web Solutions'
  },
  description: 'Professional web design and development agency specializing in creating modern, high-performance websites and digital solutions for businesses.',
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
        url: '/safari-pinned-tab.svg',
        color: '#000000', // Replace with your brand color
      }
    ]
  },
  keywords: ['web design', 'web development', 'website design', 'professional web agency', 'digital solutions', 'responsive web design', 'custom web development'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ziro.agency',
    siteName: 'ZIRO',
    title: 'ZIRO - Professional Web Design & Development Agency',
    description: 'Transform your digital presence with our expert web design and development services.',
    images: [
      {
        url: '/images/ziro.avif',
        width: 1200,
        height: 630,
        alt: 'ZIRO Web Design and Development'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZIRO - Web Design & Development Agency',
    description: 'Professional web design and development services',
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
    // todo: add google verification code
    google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebDesignCompany",
  "name": "ZIRO Agency",
  "url": "https://ziro.agency",
  "logo": "https://ziro.agency/images/ziro.avif",
  "sameAs": [
    "https://twitter.com/ziroagency",
    "https://linkedin.com/company/ziroagency"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "Poland"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://ziro.agency" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
          {children}
        <Analytics mode="production" debug={false} />
      </body>
    </html>
  )
} 