import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import '@/styles/globals.css'
import { locales, type Locale } from '@/i18n'
import { ClientWrapper } from './client-wrapper'
import { PageProvider } from '@/contexts/page-context'
import logger from '@/lib/logger'
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
import { PostHogProvider } from '@/contexts/posthog-context'
import { bannerService } from '@/lib/services/banner.service'
import { siteUrl } from '@/config/constants';
// Your GA Measurement ID
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

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
            'medical software systems'
          ]
        : [
            'rozwiązania cyfrowe dla zdrowia',
            'rozwój oprogramowania medycznego',
            'projektowanie aplikacji medycznych',
            'technologia medyczna',
            'doświadczenie pacjenta',
            'systemy dla służby zdrowia',
            'informatyka medyczna',
            'rozwiązania dla klinik'
          ],
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  let messages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    logger.log(error)
    notFound()
  }

  const initialActiveBanner = await bannerService.getActiveBanner(locale)
  console.log('initialActiveBanner', initialActiveBanner)

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Analytics Script */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure'
            });
          `}
        </Script>
      </head>
      <body className={inter.variable}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PostHogProvider>
          <PageProvider initialActiveBanner={initialActiveBanner || undefined}>
            <ClientWrapper>
              <main className="relative">{children}</main>
              </ClientWrapper>
            </PageProvider>
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
