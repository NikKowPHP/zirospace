import { type Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getBlogPostService } from '@/lib/services/blog-post.service'
import { BlogPost } from '@/domain/models/blog-post.model'
import { Suspense } from 'react'

interface PageProps {
  params: {
    locale: Locale
  }
}

const blogPostService = await getBlogPostService();

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  
  const t = await getTranslations('blog');
  
  const blogPosts = await blogPostService.getBlogPosts(locale);
  
  return (
    <div className="mx-auto py-8  py-[100px]">
      <h1 className="text-[28px] font-bold text-center mb-[64px]">{t('latest-articles')}</h1>
      <Suspense fallback={<div className="min-h-[500px]">Loading posts...</div>}>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
          {blogPosts.map((post) => (
            <BlogPostItem key={post.slug} post={post} locale={locale} />
          ))}
        </ul>
      </Suspense>
    </div>
  )
}

const BlogPostItem = ({
  post,
  locale,
}: {
  post: BlogPost
  locale: Locale
}) => {
  return <li  className=" rounded-xl ">
    <Link href={`/${locale}/blog/${post.slug}`} className="flex flex-col gap-[8px] relative">
      {post.imageurl && <Image className='w-full h-auto rounded-xl' src={post.imageurl} alt={post.imageAlt!} width={350} height={300} />}
      <h2 className="text-xl font-semibold  text-center text-[22px]">{post.title}</h2>
      <div className='absolute top-8  left-8 px-[10px] py-[5px] bg-white rounded-full'>
        {new Date(post.createdAt).toLocaleDateString()}

      </div>
    </Link>
  </li>
}

