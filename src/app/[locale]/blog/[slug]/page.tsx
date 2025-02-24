import { notFound } from 'next/navigation'
import { type Locale } from '@/i18n'
import Image from 'next/image'
import styles from './blog-post.module.css'
import { blogPostService } from '@/lib/services/blog-post.service'
import { BlogPost } from '@/domain/models/blog-post.model'
import { siteUrl } from '@/config/constants';

interface PageProps {
  params: {
    slug: string
    locale: Locale
  }
}

// Create Article JSON-LD
const createArticleJsonLd = (post: BlogPost, locale: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${siteUrl}/${locale}/blog/${post.slug}#article`,
  "headline": post.title,
  "description": post.excerpt || post.title,
  "image": post.imageurl,
  "datePublished": post.createdAt,
  "dateModified": post.createdAt,
  "inLanguage": locale,
  "publisher": {
    "@type": "Organization",
    "name": "ZIRO Healthcare Solutions",
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/images/ziro.avif`
    }
  },
  "author": {
    "@type": "Organization",
    "name": "ZIRO Healthcare Solutions"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${siteUrl}/${locale}/blog/${post.slug}`
  }
})

// Create Breadcrumb JSON-LD
const createBreadcrumbJsonLd = (post: BlogPost, locale: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${siteUrl}/${locale}`
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": `${siteUrl}/${locale}/blog`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": post.title,
      "item": `${siteUrl}/${locale}/blog/${post.slug}`
    }
  ]
})

export default async function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = await params

  // Find the blog post with the matching slug
  const post = await blogPostService.getBlogPostBySlug(slug, locale)

  // If the post doesn't exist, return a 404
  if (!post) {
    notFound()
  }

  // Calculate reading time
  const wordsPerMinute = 200;
  const wordCount = post.contentHtml.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(createArticleJsonLd(post, locale))
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(createBreadcrumbJsonLd(post, locale))
        }}
      />
      <article 
        className="blog-post py-8 py-[100px] max-w-4xl mx-auto flex flex-col gap-[35px]"
        itemScope
        itemType="https://schema.org/Article"
      >
        <meta itemProp="headline" content={post.title} />
        <meta itemProp="description" content={post.excerpt || post.title} />
        <meta itemProp="inLanguage" content={locale} />
        <meta itemProp="datePublished" content={post.createdAt} />
        <meta itemProp="dateModified" content={post.createdAt} />
        <meta itemProp="author" content="ZIRO Healthcare Solutions" />
        <meta itemProp="publisher" content="ZIRO Healthcare Solutions" />
        
        <header className="flex flex-col gap-8">
          <div className="text-sm text-gray-600 flex items-center justify-center gap-4">
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
          
          <h1 
            className="text-3xl font-bold mb-4 text-center"
            itemProp="name"
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p 
              className="text-xl text-gray-600 text-center max-w-2xl mx-auto"
              itemProp="abstract"
              dangerouslySetInnerHTML={{ 
                __html: post.excerpt.trim() 
              }}
            >
            </p>
          )}
          
          <div className="  w-full flex items-center justify-center">


          {/* <div itemProp="image " className='  w-full aspect-[16/9]'>
            <Image
              src={post.imageurl}
              alt={post.imageAlt || post.title}
              fill
              className="mb-4 rounded object-cover"
            />
          </div> */}


          <div itemProp='image' className="max-w-full mx-auto">
              <div className="relative w-full aspect-[16/9] h-[400px] sm:h-[400px] mb-16">
                <Image
                  src={post.imageurl}
                  alt={post.imageAlt || post.title}
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

        <div
          className={styles.blogPostContent}
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ 
            __html: post.contentHtml.trim() 
          }}
        />

        <footer className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col gap-4">
            {/* {post.tags && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span 
                    key={tag}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )} */}
            
            <div className="text-sm text-gray-600">
              Last updated: {' '}
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
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
      publishedTime: post.createdAt,
      modifiedTime: post.createdAt,
      images: [
        {
          url: post.imageurl,
          width: 600,
          height: 400,
          alt: post.imageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: [post.imageurl],
    },
  }
}
