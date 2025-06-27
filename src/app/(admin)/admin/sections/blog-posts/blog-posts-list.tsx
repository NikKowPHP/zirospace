'use client'

import { useEffect, useState } from 'react'
import useAdminBlogPosts from '@/hooks/admin/useAdminBlogPosts'
import { Locale } from '@/i18n'
import { useRouter } from 'next/navigation'
import logger from '@/lib/logger'

export function BlogPostList() {
  const {
    blogPosts,
    deleteBlogPost,
    error,
    loading,
    updateBlogPost,
    getBlogPosts,
  } = useAdminBlogPosts()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const router = useRouter()
  const [pinnedPostId, setPinnedPostId] = useState<string | null>(null)

  // Fetch blog posts when locale changes
  useEffect(() => {
    getBlogPosts(activeLocale)
  }, [activeLocale, getBlogPosts]) // Added getBlogPosts to dependency array

  useEffect(() => {
    // Find the currently pinned post on component mount
    const pinnedPost = blogPosts[activeLocale]?.find((post) => post.is_pinned)
    setPinnedPostId(pinnedPost?.id || null)
  }, [blogPosts, activeLocale])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlogPost(id, activeLocale)
      } catch (error) {
        logger.log('Failed to delete blog post:', error)
      }
    }
  }

  const handlePin = async (postId: string) => {
    try {
      // Unpin the currently pinned post if there is one
      if (pinnedPostId) {
        await updateBlogPost(pinnedPostId, { is_pinned: false }, activeLocale)
      }
      // Pin the selected post
      await updateBlogPost(postId, { is_pinned: true }, activeLocale)
      setPinnedPostId(postId)
    } catch (error) {
      logger.log('Failed to pin/unpin blog post:', error)
    }
  }

  return (
    <div className="space-y-8">
      {error && <div className="p-4 bg-red-50 text-red-600  ">{error}</div>}

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
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
        <button
          onClick={() => router.push(`/admin/sections/blog-posts/create`)}
          className="px-6 py-3 text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          Add Blog Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts[activeLocale]?.map((post) => (
          <div
            key={post.id}
            className={`bg-white rounded-lg shadow-md p-6 space-y-4 ${
              loading ? 'opacity-50' : ''
            }`}
          >
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Slug:</span> {post.slug}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">URL Preview:</span> /blog/
              {post.slug}
            </p>
            <p className="text-sm text-gray-600 line-clamp-3">
              <span className="font-medium">Excerpt:</span> {post.excerpt}
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="pinned-post"
                value={post.id}
                checked={post.is_pinned}
                onChange={() => handlePin(post.id)}
                disabled={loading}
                className="cursor-pointer h-10 w-10 text-primary focus:ring-primary border-gray-300"
              />
              <label
                htmlFor={`pinned-${post.id}`}
                className="text-sm text-gray-700"
              >
                Pinned
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  router.push(
                    `/admin/sections/blog-posts/edit/${post.id}?locale=${activeLocale}`
                  )
                }
                className="text-primary hover:text-primary/90 disabled:opacity-50 font-medium"
                disabled={loading}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id.toString())}
                className="text-red-600 hover:text-red-900 disabled:opacity-50 font-medium"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
