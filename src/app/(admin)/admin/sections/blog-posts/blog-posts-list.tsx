'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '@/contexts/admin-context'
import { Locale } from '@/i18n'
import { useRouter } from 'next/navigation'
import logger from '@/lib/logger'

export function BlogPostList() {
  const { blogPosts, deleteBlogPost, error, loading, updateBlogPost } =
    useAdmin()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const router = useRouter()
  const [pinnedPostId, setPinnedPostId] = useState<string | null>(null)

  useEffect(() => {
    // Find the currently pinned post on component mount
    const pinnedPost = blogPosts[activeLocale]?.find((post) => post.isPinned)
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
        await updateBlogPost(pinnedPostId, { isPinned: false }, activeLocale)
      }
      // Pin the selected post
      await updateBlogPost(postId, { isPinned: true }, activeLocale)
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

      <div className="overflow-hidden bg-white   shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Excerpt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pinned
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blogPosts[activeLocale].map((post) => (
              <tr key={post.id} className={loading ? 'opacity-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{post.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">/blog/{post.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {post.excerpt}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="radio"
                    name="pinned-post"
                    value={post.id}
                    checked={post.isPinned}
                    onChange={() => handlePin(post.id)}
                    disabled={loading}
                    className="cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/sections/blog-posts/edit/${post.id}?locale=${activeLocale}`
                      )
                    }
                    className="text-primary hover:text-primary/90 disabled:opacity-50"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id.toString())}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
