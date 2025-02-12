import { Metadata } from "next";

export const homePageMetadata: Metadata = {
  title: 'ZIRO | Digital Health Solutions & Medical Software Development',
  description: 'Transform healthcare through innovative digital solutions. Specializing in medical software development, health tech UI/UX, and patient-centric digital products.',
  keywords: [
    'digital health solutions',
    'healthcare software development',
    'medical app design',
    'health tech UI/UX',
    'patient experience design',
    'clinical workflow solutions',
    'healthcare technology',
    'medical software systems'
  ],
  alternates: {
    canonical: 'https://ziro.space',
    languages: {
      'en-US': '/en',
      'pl-PL': '/pl',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ziro.space',
    siteName: 'ZIRO Healthcare Solutions',
    title: 'ZIRO | Healthcare Technology Solutions',
    description: 'Innovative digital health solutions and medical software development for modern healthcare providers.',
    images: [{
      url: 'https://ziro.space/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'ZIRO Healthcare Technology Solutions'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ziroagency',
    creator: '@ziroagency',
    title: 'ZIRO Healthcare Solutions',
    description: 'Digital health solutions and medical software development',
    images: ['https://ziro.space/images/og-image.jpg'],
  },
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    'facebook-domain-verification': process.env.FACEBOOK_DOMAIN_VERIFICATION || '',
  }
}
