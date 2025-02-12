'use client'

import { Locale } from '@/i18n'
import { useAdmin } from '@/contexts/admin-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { BlogPostForm } from '../../components/blog-post-form'
import { useEffect, useState } from 'react'
import { BlogPost } from '@/domain/models/blog-post.model'
import logger from '@/lib/logger'

interface Props {
  params: { id: string }
}

export default function EditBlogPostPage({params}: Props) {
  const { updateBlogPost, loading, getBlogPost  } = useAdmin()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = searchParams.get('locale') || 'en';
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [id, setId] = useState<string>('')

  useEffect(() => {
    const { id } = params
    if (id) {
      setId(id)
    }
  
    getBlogPost(id, locale).then(post => setBlogPost(post || null))
  }, [params, getBlogPost, locale])

  const handleUpdate = async (data: Partial<BlogPost>) => {
    if (!blogPost) return;
    try {
      await updateBlogPost(id, data, locale)
      router.push('/admin/sections/blog-posts')
    } catch (error) {
      logger.log('Failed to update blog post:', error)
    }
  }

  if(!blogPost && loading) {
    return <div>Loading...</div>
  }
  if(!blogPost) {
    return <div>Blog post not found</div>
  }

  return (
    <div>
      <h1>Edit Blog Post</h1>
      <BlogPostForm
        post={blogPost}
        locale={locale as Locale}
        onSubmit={handleUpdate}
        onCancel={() => router.push('/admin/sections/blog-posts')}
        loading={loading}
      />
    </div>
  )
}