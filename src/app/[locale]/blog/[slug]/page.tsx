import { notFound } from 'next/navigation'
import { type Locale } from '@/i18n'
import Image from 'next/image'
import styles from './blog-post.module.css'
import { blogPostService } from '@/lib/services/blog-post.service'
interface PageProps {
  params: {
    slug: string
    locale: Locale
  }
}



export default async function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = await params

  // Find the blog post with the matching slug
  const post = await blogPostService.getBlogPostBySlug(slug, locale)

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
          className="mb-4 rounded w-full"
        />
      </header>

      <div
         className={styles.blogPostContent}
        dangerouslySetInnerHTML={{ 
          __html: post.contentHtml.trim() 
        }}
      />
    </article>
  )
}
