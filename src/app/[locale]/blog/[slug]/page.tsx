import { notFound } from 'next/navigation'
import { type Locale } from '@/i18n'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button/button'

// Import the mock blogPosts array
import { blogPosts } from '@/lib/data/blog-posts.mock.data'

interface PageProps {
  params: {
    slug: string
    locale: Locale
  }
}

export default function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = params

  // Find the blog post with the matching slug
  const post = blogPosts.find((post) => post.slug === slug)

  // If the post doesn't exist, return a 404
  if (!post) {
    notFound()
  }

  return (
    <article className="blog-post py-8 py-[100px] max-w-5xl mx-auto border border-red-500 flex flex-col gap-[35px]">
      <header className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
        <Image
          src={post.imageurl}
          alt={post.imageAlt || 'Blog Post Image'}
          width={600}
          height={400}
          className="mb-4 rounded"
        />
      </header>

      <div
        className="blog-post-content text-gray-700"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  )
}
