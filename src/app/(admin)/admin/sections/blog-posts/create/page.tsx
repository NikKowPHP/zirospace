'use client'

import { Locale } from '@/i18n'
import useAdminBlogPosts from '@/hooks/admin/useAdminBlogPosts'
import { useRouter } from 'next/navigation'
import { BlogPostForm } from '../components/blog-post-form'
import { useState } from 'react'
import { BlogPost } from '@/domain/models/models'
import logger from '@/lib/logger'

export default function NewBlogPostPage() {
  const { createBlogPost, loading } = useAdminBlogPosts()
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')

  const handleCreate = async (data: Partial<BlogPost>) => {
    try {
      await createBlogPost(data, activeLocale)
      router.push('/admin/sections/blog-posts')
    } catch (error) {
      logger.log('Failed to create blog post:', error)
    }
  }

  return (
    <div>
      <h1>New Blog Post</h1>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveLocale('en')}
          className={`px-6 py-3 rounded-full transition-colors ${
            activeLocale === 'en'
              ? 'bg-primary text-white'
              : 'bg-secondary text-gray-700 hover:bg-secondary/80'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setActiveLocale('pl')}
          className={`px-6 py-3 rounded-full transition-colors ${
            activeLocale === 'pl'
              ? 'bg-primary text-white'
              : 'bg-secondary text-gray-700 hover:bg-secondary/80'
          }`}
        >
          Polish
        </button>
      </div>

      <BlogPostForm
        locale={activeLocale}
        onSubmit={handleCreate}
        onCancel={() => router.push('/admin/sections/blog-posts')}
        loading={loading}
      />
    </div>
  )
}