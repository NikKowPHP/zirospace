import { type Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPostService } from '@/lib/services/blog-post.service'
import { BlogPost } from '@/domain/models/blog-post.model'
import { Suspense } from 'react'
import { siteUrl } from '@/config/constants'
interface PageProps {
  params: {
    locale: Locale
  }
}

 const stripHtmlTags =(htmlString: string) => {
  if (!htmlString) {
    return ''; // Handle null, undefined, or empty strings
  }
  // Use a regular expression to find and replace HTML tags
  // <   : Matches the opening angle bracket
  // [^>] : Matches any character EXCEPT a closing angle bracket
  // *   : Matches the previous character zero or more times
  // >   : Matches the closing angle bracket
  // g   : Global flag - replace all occurrences, not just the first
  return htmlString.replace(/<[^>]*>/g, '');
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

const blogPostService =  getBlogPostService()

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params
  const blogPosts = await blogPostService.getBlogPosts(locale)

  return (
    <div className=' '>
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
        className="mx-auto max-w-5xl py-[100px] "
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
          <ul className="" itemScope itemType="https://schema.org/ItemList">
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
    </div>
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
  const formatedDate = new Date(post.createdAt).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  })
const cleanedExcerpt = stripHtmlTags(post.excerpt);

  return (
    <li
      className=""
      itemScope
      itemType="https://schema.org/BlogPosting"
      itemProp="itemListElement"
    >
      <Link href={`/${locale}/blog/${post.slug}`} className="" itemProp="url">
        <div className="flex border-b  py-[32px] gap-[32px] justify-between">
          <div className="flex flex-col gap-[4px]">
            <h2 className=" font-semibold  text-[19px]" itemProp="headline">
              {post.title}
            </h2>
            <p className="text-[15px]">
              {cleanedExcerpt}
              {/* Empowering Healthcare Innovation Through Human-Centered Design and */}
              {/* Collaborative Solutions */}
            </p>
            {/* MAR 28 DATE DYNAMIC */}
            <span className="uppercase text-[11px] text-[#868787]">
              {formatedDate} <span>•</span>{' '}
              <span className="uppercase">NIKHIL SINGH</span>
            </span>
          </div>
          {post.imageurl && (
           <div itemProp="image" className="w-full sm:w-[250px]  aspect-video overflow-hidden relative">
              <Image
                className="rounded-xl w-full h-auto"
                src={post.imageurl}
                // src="https://picsum.photos/250/150"
                alt={post.imageAlt || post.title}
                style={{ objectFit: 'cover' }}
              fill

                loading="lazy"
              />
            </div>
          )}
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
  const formatedDate = new Date(post.createdAt).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  })
  const cleanedExcerpt = stripHtmlTags(post.excerpt);
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="flex flex-col gap-[8px]"
      itemProp="url"
    >
      <div className="flex flex-col sm:flex-row justify-start items-center gap-[32px] rounded-md  mb-[32px] ">
        {post.imageurl && (
          <div itemProp="image" className="w-full sm:w-[350px] md:w-[458px] aspect-video overflow-hidden relative">
            <Image
              className="rounded-xl w-full h-auto"
              src={post.imageurl}
              // src="https://picsum.photos/458/305"
              alt={post.imageAlt || post.title}
              style={{ objectFit: 'cover' }}
              fill
              
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col items-center gap-[8px] p-10">
          <h2
            className=" font-semibold text-center text-[30px]"
            itemProp="headline"
          >
            {post.title}
          </h2>
          <p className="text-[17px] text-center ">{cleanedExcerpt}</p>
          {/* MAR 28 DATE DYNAMIC */}
          <span className="uppercase text-[11px] text-[#868787]">
            {formatedDate} <span>•</span>{' '}
            <span className="uppercase">NIKHIL SINGH</span>
          </span>
        </div>
      </div>
      <hr className="" />
    </Link>
  )
}
