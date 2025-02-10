'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '@/contexts/admin-context'
import { BlogPost } from '@/domain/models/blog-post.model'
import { Locale } from '@/i18n'
import { BlogPostForm } from './components/blog-post-form'

export function BlogPostList() {
  const { blogPosts, createBlogPost, updateBlogPost, deleteBlogPost, error, loading } = useAdmin()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  const handleCreate = async (data: Partial<BlogPost>) => {
    try {
      await createBlogPost(data, activeLocale)
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create blog post:', error)
    }
  }

  const handleUpdate = async (data: Partial<BlogPost>) => {
    if (!editingPost) return
    try {
      await updateBlogPost(editingPost.id, data, activeLocale)
      setEditingPost(null)
    } catch (error) {
      console.error('Failed to update blog post:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlogPost(id, activeLocale)
      } catch (error) {
        console.error('Failed to delete blog post:', error)
      }
    }
  }

  useEffect(() => { console.log(blogPosts) }, [blogPosts])

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-primary">
          {error}
        </div>
      )}

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
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          Add Blog Post
        </button>
      </div>

      {(isCreating || editingPost) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-primary p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-[32px] font-medium tracking-[-0.02em] text-gray-900 mb-8">
              {editingPost ? 'Edit Blog Post' : 'New Blog Post'}
            </h3>
            <BlogPostForm
              post={editingPost ?? undefined}
              locale={activeLocale}
              onSubmit={editingPost ? handleUpdate : handleCreate}
              onCancel={() => {
                setEditingPost(null)
                setIsCreating(false)
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white rounded-primary shadow">
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
                  <div className="text-sm text-gray-500">
                    {post.slug}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    /blog/{post.slug}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {post.excerpt}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="text-primary hover:text-primary/90 disabled:opacity-50"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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