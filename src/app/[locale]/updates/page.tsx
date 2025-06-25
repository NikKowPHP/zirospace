import { Metadata } from 'next'
import { updateService } from '@/lib/services/update.service'
import { notFound } from 'next/navigation'
import { Locale } from '@/i18n'
import { Update } from '@/domain/models/models'

const UPDATES_CONFIG = {
  siteName: 'ZIRO Healthcare Solutions',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ziro.health',
  logoUrl: '/images/ziro.avif',
  title: 'Updates | Ziro',
  description: 'Stay up-to-date with the latest news and updates from Ziro.',
  wordsPerMinute: 200,
} as const

export const generateMetadata = async ({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> => {
  return {
    title: UPDATES_CONFIG.title,
    description: UPDATES_CONFIG.description,
    // JSON-LD
    openGraph: {
      title: UPDATES_CONFIG.title,
      description: UPDATES_CONFIG.description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/updates`,
      siteName: 'Zirospace',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: UPDATES_CONFIG.title,
      description: UPDATES_CONFIG.description,
      site: '@zirospace',
      creator: '@zirospace',
    },
    metadataBase: new URL(UPDATES_CONFIG.siteUrl),
    alternates: {
      canonical: `/${locale}/updates`,
      languages: {
        'en-US': '/en/updates',
        'pl-PL': '/pl/updates',
      },
    },
  }
}
async function fetchUpdates(locale: Locale): Promise<Update[]> {
  const updates = await updateService.getUpdates(locale)
  if (!updates) notFound()
  return updates
}

function sortUpdates(updates: Update[]): Update[] {
  return [...updates].sort((a, b) => {
    const publishDateComparison =
      (b.publish_date?.getTime() || 0) - (a.publish_date?.getTime() || 0)
    if (publishDateComparison !== 0) {
      return publishDateComparison
    }
    return (a.order_index || 0) - (b.order_index || 0)
  })
}

function renderPublishDate(update: Update): String {
  return update.publish_date
    ? new Date(update.publish_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
}

const UpdatesPage = async ({
  params: { locale },
}: {
  params: { locale: Locale }
}) => {
  try {
    const updates = await fetchUpdates(locale)

    const sortedUpdates = sortUpdates(updates)

    return (
      <div className="max-w-3xl mx-auto py-24">
        <h1 className="text-2xl font-bold mb-4">Updates</h1>
        {sortedUpdates.map((update) => (
          <div key={update.id} className="mb-4">
            <h2 className="text-xl font-semibold">{update.title}</h2>
            <p className="text-gray-600">{renderPublishDate(update)}</p>
            {update.image_url && (
              <img src={update.image_url} alt={update.title} className="mt-2" />
            )}
            <div
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: update.content_html || '' }}
            />
          </div>
        ))}
      </div>
    )
  } catch (error: any) {
    console.error('Error fetching updates:', error)
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Updates</h1>
        <p className="text-red-500">
          Error: {error.message || 'Failed to load updates'}
        </p>
      </div>
    )
  }
}

export default UpdatesPage
