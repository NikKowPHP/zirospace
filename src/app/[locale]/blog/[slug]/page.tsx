import { notFound } from 'next/navigation'
import { type Locale } from '@/i18n'
import Image from 'next/image'
import styles from './blog-post.module.css'
import { blogPostService } from '@/lib/services/blog-post.service'
import { BlogPost } from '@/domain/models/models'
import { siteUrl } from '@/config/constants'
import '@/styles/blog.css'
import { timestampToLocaleDateString } from '@/lib/utils/timestamp-to-locale-date-string'
interface PageProps {
  params: {
    slug: string
    locale: Locale
  }
}

const BLOG_CONFIG = {
  siteName: 'ZIRO Healthcare Solutions',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ziro.health',
  logoUrl: '/images/ziro.avif',
  wordsPerMinute: 200,
} as const

const createArticleJsonLd = (post: BlogPost, locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${BLOG_CONFIG.siteUrl}/${locale}/blog/${post.slug}#article`,
  headline: post.title,
  description: post.excerpt || post.title,
  image: post.image_url,
  datePublished: post.created_at,
  dateModified: post.created_at,
  inLanguage: locale,
  publisher: {
    '@type': 'Organization',
    name: BLOG_CONFIG.siteName,
    logo: {
      '@type': 'ImageObject',
      url: `${BLOG_CONFIG.siteUrl}${BLOG_CONFIG.logoUrl}`,
    },
  },
  author: {
    '@type': 'Organization',
    name: BLOG_CONFIG.siteName,
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${BLOG_CONFIG.siteUrl}/${locale}/blog/${post.slug}`,
  },
  wordCount: post.content_html
    ? post.content_html.trim().split(/\s+/).length
    : 0,
  timeRequired: `PT${calculateReadingTime(post)}M`,

  articleSection: 'Healthcare',
})

const createBreadcrumbJsonLd = (post: BlogPost, locale: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${siteUrl}/${locale}`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: `${siteUrl}/${locale}/blog`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: post.title,
      item: `${siteUrl}/${locale}/blog/${post.slug}`,
    },
  ],
})

function calculateReadingTime(post: BlogPost): number {
  const wordsPerMinute = 200
  const content = post?.content_html?.trim() ?? ''
  if (!content) return 0
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

async function fetchBlogPost(slug: string, locale: Locale): Promise<BlogPost> {
  const post = await blogPostService.getBlogPostBySlug(slug, locale)
  if (!post) notFound()
  return post
}

function renderMetaData(post: BlogPost, locale: Locale) {
  return (
    <>
      <meta itemProp="headline" content={post.title} />
      <meta itemProp="description" content={post.excerpt || post.title} />
      <meta itemProp="inLanguage" content={locale} />
      <meta itemProp="datePublished" content={post.created_at} />
      <meta itemProp="dateModified" content={post.created_at} />
      <meta itemProp="author" content="ZIRO Healthcare Solutions" />
      <meta itemProp="publisher" content="ZIRO Healthcare Solutions" />
    </>
  )
}

function renderJsonLdScripts(post: BlogPost, locale: Locale) {
  try {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createArticleJsonLd(post, locale)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createBreadcrumbJsonLd(post, locale)),
          }}
        />
      </>
    )
  } catch (error) {
    console.error('Error generating JSON-LD:', error)
    return null
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = params
  const post = await fetchBlogPost(slug, locale)
  const readingTime = calculateReadingTime(post)

  return (
    <>
      {renderJsonLdScripts(post, locale)}
      <article
        className="blog-post  py-[100px] max-w-3xl mx-auto flex flex-col gap-[35px] spectral-regular"
        itemScope
        itemType="https://schema.org/Article"
      >
        {renderMetaData(post, locale)}

        <header className="flex flex-col gap-8">
          <h1
            className="text-[32px] leading-[1.2] font-bold mb-[12px] "
            itemProp="name"
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              className="text-[18px] text-gray-500 "
              itemProp="abstract"
              dangerouslySetInnerHTML={{
                __html: post.excerpt.trim(),
              }}
            ></p>
          )}
          <div className="text-[11px] text-gray-600 flex  gap-4 pb-[15px] border-b ">
            <time dateTime={post.created_at}>
              {timestampToLocaleDateString(post.created_at, locale)}
            </time>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>

          <div className="w-full flex items-center justify-center pt-[10px]">
            <div itemProp="image" className="max-w-full mx-auto">
              <div className="relative w-[400px] sm:w-[450px]  h-[400px] sm:h-[450px] mb-16">
                <Image
                  src={post.image_url}
                  alt={post.image_alt || post.title}
                  fill
                  className="object-cover rounded-primary-lg"
                  priority
                  itemProp="image"
                  quality={100}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </header>

        {post.content_html && (
          <div
            className={styles.blogPostContent}
            itemProp="articleBody"
            dangerouslySetInnerHTML={{
              __html: post.content_html.trim(),
            }}
          />
        )}

        <footer className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-600">
              Last updated:{' '}
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>
        </footer>
      </article>
    </>
  )
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = params
  const post = await blogPostService.getBlogPostBySlug(slug, locale)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.created_at,
      images: [
        {
          url: post.image_url,
          width: 600,
          height: 400,
          alt: post.image_alt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: [post.image_url],
    },
  }
}
