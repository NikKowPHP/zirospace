'use client'

import { Locale } from '@/i18n'
import { useAdmin } from '@/contexts/admin-context'
import { useRouter } from 'next/navigation'
import { BlogPostForm } from '../../components/blog-post-form'
import { useState } from 'react'
import { BlogPost } from '@/domain/models/blog-post.model'

export default function NewBlogPostPage() {
  const { createBlogPost, loading } = useAdmin()
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')

  const handleCreate = async (data: Partial<BlogPost>) => {
    try {
      await createBlogPost(data, activeLocale)
      router.push('/admin/sections/blog-posts')
    } catch (error) {
      console.error('Failed to create blog post:', error)
    }
  }

  return (
    <div>
      <h1>New Blog Post</h1>
      <BlogPostForm
        locale={activeLocale}
        onSubmit={handleCreate}
        onCancel={() => router.push('/admin/sections/blog-posts')}
        loading={loading}
      />
    </div>
  )
}