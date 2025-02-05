import { Metadata } from "next";

export const homePageMetadata: Metadata = {
  title: 'Professional Web Design & Development Services | ZIRO Agency',
  description: 'Expert web design and development services for modern businesses. Custom websites, responsive design, and cutting-edge web solutions.',
  keywords: ['web design', 'web development', 'custom websites', 'responsive design', 'web agency'],
  alternates: {
    canonical: 'https://ziro.agency',
    languages: {
      'en-US': '/en',
      'pl-PL': '/pl',
    },
  },
  openGraph: {
    title: 'Expert Web Design & Development | ZIRO',
    description: 'Transform your online presence with our professional web solutions',
    images: [{
      url: '/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'ZIRO Web Design Services'
    }]
  }
}
