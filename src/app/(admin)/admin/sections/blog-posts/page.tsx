'use client'

import { BlogPostList } from './blog-posts-list'
import { Suspense, useEffect } from 'react'
import { AdminProvider } from '@/contexts/admin-context'
import useAdminBlogPosts from '@/hooks/admin/useAdminBlogPosts'
import { Locale } from '@/i18n'

export default function BlogPostsAdminPage() {
  const { getBlogPosts, blogPosts, loading } = useAdminBlogPosts();

  useEffect(() => {
    getBlogPosts('en' as Locale);
    getBlogPosts('pl' as Locale);
  }, [getBlogPosts]);

  if (loading && (!blogPosts.en.length || !blogPosts.pl.length)) {
    return <div>Loading blog posts...</div>;
  }

  return (
    <AdminProvider initialBlogPosts={blogPosts}>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">Blog Posts Management</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <BlogPostList />
          </Suspense>
        </div>
      </div>
    </AdminProvider>
  )
}
