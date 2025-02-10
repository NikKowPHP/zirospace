import { type Locale } from '@/i18n'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { blogPosts } from '@/lib/data/blog-posts.mock.data'
interface PageProps {
  params: {
    locale: Locale
  }
}


export default function BlogPage({ params }: PageProps) {
  const { locale } = params
  const t = useTranslations('blog')
  
  return (
    <div className=" mx-auto py-8 border border-red-500 py-[100px]">
      <h1 className="text-[28px] font-bold  text-center mb-[64px]">{t('latest-articles')}</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
        {blogPosts.map((post) => (
          <BlogPost post={post} locale={locale} />
        ))}
      </ul>
    </div>
  )
}

const BlogPost = ({
  post,
  locale,
}: {
  post: (typeof blogPosts)[number]
  locale: Locale
}) => {
  return <li key={post.slug} className="border border-blue-500 rounded-xl ">
    <Link href={`/${locale}/blog/${post.slug}`} className="flex flex-col gap-[8px] relative">
      <Image className='w-full h-auto rounded-xl' src={post.imageurl} alt={post.imageAlt!} width={350} height={300} />
      <h2 className="text-xl font-semibold border border-red-500 text-center text-[22px]">{post.title}</h2>
      <div className='absolute top-8  left-8 px-[10px] py-[5px] bg-white rounded-full'>
        {post.createdAt}

      </div>
    </Link>
  </li>
}
