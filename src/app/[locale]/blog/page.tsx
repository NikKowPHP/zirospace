import { type Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getBlogPostService } from '@/lib/services/blog-post.service'
import { BlogPost } from '@/domain/models/blog-post.model'
import { Suspense } from 'react'
import { siteUrl } from '@/config/constants'
interface PageProps {
  params: {
    locale: Locale
  }
}

// Blog JSON-LD
const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': `${siteUrl}/blog/#blog`,
  name: 'ZIRO Healthcare Technology Blog',
  description:
    'Expert insights on healthcare technology, medical software development, and digital health solutions.',
  publisher: {
    '@type': 'Organization',
    name: 'ZIRO Healthcare Solutions',
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/ziro.avif`,
    },
  },
}

// Blog Posts List JSON-LD
const createBlogListJsonLd = (posts: BlogPost[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: posts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'BlogPosting',
      headline: post.title,
      image: post.imageurl,
      datePublished: post.createdAt,
      author: {
        '@type': 'Organization',
        name: 'ZIRO Healthcare Solutions',
      },
      url: `${siteUrl}/blog/${post.slug}`,
    },
  })),
})

// Breadcrumb JSON-LD
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${siteUrl}`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: `${siteUrl}/blog`,
    },
  ],
}

const blogPostService = await getBlogPostService()

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations('blog')
  const blogPosts = await blogPostService.getBlogPosts(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createBlogListJsonLd(blogPosts)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div
        className="mx-auto max-w-5xl py-[100px]"
        itemScope
        itemType="https://schema.org/Blog"
      >
        <meta itemProp="name" content="ZIRO Healthcare Technology Blog" />
        <meta
          itemProp="description"
          content="Latest insights and articles about healthcare technology, medical software development, and digital health solutions."
        />
        <meta itemProp="inLanguage" content={locale} />

        {/* <h1 className="text-[28px] font-bold text-center mb-[64px]">
          {t('latest-articles')}
        </h1> */}

        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-[500px]">
              <span className="sr-only">Loading healthcare articles...</span>
              Loading posts...
            </div>
          }
        >
          {/* PINNED POST */}
            {blogPosts
              .filter((post) => post.isPinned)
              .map((post) => (
                <PinnedBlogPost
                  key={post.slug}
                  post={post}
                  locale={locale}
                  // position={1}
                />
              ))}
          <ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            {blogPosts.map((post, index) => (
              <BlogPostItem
                key={post.slug}
                post={post}
                locale={locale}
                position={index + 1}
              />
            ))}
          </ul>
        </Suspense>
      </div>
    </>
  )
}

const BlogPostItem = ({
  post,
  locale,
  position,
}: {
  post: BlogPost
  locale: Locale
  position: number
}) => {
  return (
    <li
      className="rounded-xl"
      itemScope
      itemType="https://schema.org/BlogPosting"
      itemProp="itemListElement"
    >
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="flex flex-col gap-[8px] relative"
        itemProp="url"
      >
        {post.imageurl && (
          <div itemProp="image" className="max-w-sm">
            <Image
              className="h-auto rounded-xl"
              // src={post.imageurl}
              src="https://picsum.photos/300/200"
              alt={post.imageAlt || post.title}
              width={350}
              height={300}
              loading="lazy"
            />
          </div>
        )}
        <h2
          className="text-xl font-semibold text-center text-[22px]"
          itemProp="headline"
        >
          {post.title}
        </h2>
        <div
          className="absolute top-8 left-8 px-[10px] py-[5px] bg-white rounded-full"
          itemProp="datePublished"
        >
          {new Date(post.createdAt).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <meta itemProp="position" content={String(position)} />
      </Link>
    </li>
  )
}

const PinnedBlogPost = ({
  post,
  locale,
}: {
  post: BlogPost
  locale: Locale
}) => {
  return (
 
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="flex flex-col gap-[8px]"
        itemProp="url"
      >
        <div className="flex justify-start items-center gap-[32px] rounded-md  mb-10 ">
          {post.imageurl && (
            <div itemProp="image" className='w-[458px]'>
              <Image
                className="rounded-xl"
                // src={post.imageurl}
                src="https://picsum.photos/458/305"

                alt={post.imageAlt || post.title}
                width={458}
                height={305}
                loading="lazy"
              />
            </div>
          )}
        <div className='flex flex-1 flex-col items-center gap-[8px] p-10'>

          <h2
            className=" font-semibold text-center text-[22px]"
            itemProp="headline"
          >
            {post.title}
          </h2>
          <p className='text-[17px] text-center '>{post.excerpt}</p>
         
          </div>
        </div>
        <hr className='mb-10' />
      </Link>
  )
}
