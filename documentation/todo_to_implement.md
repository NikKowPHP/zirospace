The issue you're encountering, where only the testimonials section in the admin panel is consistently displaying data, while others are not, stems from an inconsistency in how data is re-fetched on the client-side after initial server-side rendering.

Here's a breakdown of the problem and the proposed solution:

**Root Cause Analysis:**

1.  **Server-Side Initial Data:** For most admin sections (Case Studies, Blog Posts, Banners, Services, Testimonials), the `AdminProvider` (which wraps the main admin content) correctly fetches initial data on the server and passes it to the respective `useAdmin*` hooks.
2.  **Client-Side Re-fetching:**
    *   **Testimonials (Working Correctly):** The `src/app/(admin)/admin/sections/testimonials/testimonials-list.tsx` component explicitly includes a `useEffect` hook that calls `getTestimonials(activeLocale)` whenever the `activeLocale` state changes. This ensures that when a user switches between English and Polish tabs, the data is re-fetched from the API.
    *   **Other Sections (Not Working Consistently):** For Case Studies, Blog Posts, Banners, and Services, the corresponding `*-list.tsx` components (e.g., `case-studies-interactive.tsx`, `blog-posts-list.tsx`, `banner-list.tsx`, `service-list.tsx`) **do not have this `useEffect` to trigger a re-fetch** when the `activeLocale` changes. They rely solely on the `initialData` provided by the server. If the server provides empty data for a locale, or if the data becomes stale, these sections won't update.
    *   **Case Study Sliders (Not Locale-Specific, but still an issue):** The `src/app/(admin)/admin/sections/case-study-sliders/sliders-list.tsx` component also lacks a `useEffect` to call `getCaseStudySliders()` on mount. While this section isn't locale-dependent, it still needs to trigger its own fetch after the initial server-side hydration, especially if `initialCaseStudySliders` was empty or if the component re-mounts.
    *   **Hero and Youtube (Working Correctly):** These sections handle their data fetching directly within their `page.tsx` files (or their `useAdmin*` hook if they had one), including explicit `useEffect` calls to `fetchHeroSection(activeLocale)` or `getYoutubeAction()`. This is why they work as expected.
    *   **Updates (Working Correctly):** Similar to Testimonials, the `src/app/(admin)/admin/sections/updates/page.tsx` explicitly calls `fetchUpdates(activeLocale)` in a `useEffect`.

**Solution:**

To fix this, we need to add `useEffect` hooks in the client-side list components of the affected admin sections to trigger data re-fetching from their respective `useAdmin*` hooks when the `activeLocale` changes (or on mount for non-locale-specific data).

**Changes to be Implemented:**

1.  **`src/app/(admin)/admin/sections/case-studies/case-studies-interactive.tsx`**
    *   Add a `useEffect` to call `getCaseStudies(activeLocale)` when `activeLocale` changes.

2.  **`src/app/(admin)/admin/sections/blog-posts/blog-posts-list.tsx`**
    *   Add a `useEffect` to call `getBlogPosts(activeLocale)` when `activeLocale` changes.

3.  **`src/app/(admin)/admin/sections/banners/banner-list.tsx`**
    *   Add a `useEffect` to call `getBanners(activeLocale)` when `activeLocale` changes.

4.  **`src/app/(admin)/admin/sections/services/service-list.tsx`**
    *   Add a `useEffect` to call `getServices(activeLocale)` when `activeLocale` changes.

5.  **`src/app/(admin)/admin/sections/case-study-sliders/sliders-list.tsx`**
    *   Add a `useEffect` to call `getCaseStudySliders()` on component mount.

---

**Detailed File Modifications:**

<change file="src/app/(admin)/admin/sections/case-studies/case-studies-interactive.tsx" />

```typescript
'use client'

import { useEffect, useState } from 'react'
import useAdminCaseStudies from '@/hooks/admin/useAdminCaseStudies'
import { CaseStudy } from '@/domain/models/models'
import { Locale } from '@/i18n'
import { CaseStudyForm } from './components/case-study-form'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export function CaseStudyListInteractive() {
  const { caseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy, updateCaseStudyOrder, error, loading, getCaseStudies } = useAdminCaseStudies()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [orderedStudies, setOrderedStudies] = useState<CaseStudy[]>([])

  // Fetch case studies when locale changes
  useEffect(() => {
    getCaseStudies(activeLocale)
  }, [activeLocale, getCaseStudies]) // Added getCaseStudies to dependency array

  useEffect(() => {
    setOrderedStudies(caseStudies[activeLocale])
  }, [activeLocale, caseStudies])
  
  const handleCreate = async (data: Partial<CaseStudy>) => {
    try {
      await createCaseStudy(data, activeLocale)
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create case study:', error)
    }
  }

  const handleUpdate = async (data: Partial<CaseStudy>) => {
    if (!editingStudy) return
    try {
      await updateCaseStudy(editingStudy.id, data, activeLocale)
      setEditingStudy(null)
    } catch (error) {
      console.error('Failed to update case study:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this case study?')) {
      try {
        await deleteCaseStudy(id, activeLocale)
      } catch (error) {
        console.error('Failed to delete case study:', error)
      }
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(orderedStudies)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setOrderedStudies(items)

    const orders = items.map((study, index) => ({
      id: study.id,
      order: index
    }));
    try {
      await updateCaseStudyOrder(orders, activeLocale)
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  useEffect(() => { console.log(caseStudies) }, [caseStudies])

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
              activeLocale === 'en' ? 'bg-primary text-white' : 'bg-secondary text-gray-700 hover:bg-secondary/80'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setActiveLocale('pl')}
            className={`px-6 py-3 rounded-full transition-colors ${
              activeLocale === 'pl' ? 'bg-primary text-white' : 'bg-secondary text-gray-700 hover:bg-secondary/80'
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
          Add Case Study
        </button>
      </div>

      {(isCreating || editingStudy) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-primary p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-[32px] font-medium tracking-[-0.02em] text-gray-900 mb-8">
              {editingStudy ? 'Edit Case Study' : 'New Case Study'}
            </h3>
            <CaseStudyForm
              study={editingStudy ?? undefined}
              locale={activeLocale}
              onSubmit={editingStudy ? handleUpdate : handleCreate}
              onCancel={() => {
                setEditingStudy(null)
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
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="caseStudies">
              {(provided) => (
                <tbody className="divide-y divide-gray-200" {...provided.droppableProps} ref={provided.innerRef}>
                  {orderedStudies.map((study, index) => (
                    <Draggable key={study.id} draggableId={study.id} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={loading ? 'opacity-50' : ''}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {study.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {study.slug}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              /case-studies/{study.slug}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {study.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            <button
                              onClick={() => setEditingStudy(study)}
                              className="text-primary hover:text-primary/90 disabled:opacity-50"
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(study.id)}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
        </table>
      </div>
    </div>
  )
}
```

<change file="src/app/(admin)/admin/sections/blog-posts/blog-posts-list.tsx" />

```typescript
'use client'

import { useEffect, useState } from 'react'
import useAdminBlogPosts from '@/hooks/admin/useAdminBlogPosts'
import { Locale } from '@/i18n'
import { useRouter } from 'next/navigation'
import logger from '@/lib/logger'

export function BlogPostList() {
  const { blogPosts, deleteBlogPost, error, loading, updateBlogPost, getBlogPosts } =
    useAdminBlogPosts()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const router = useRouter()
  const [pinnedPostId, setPinnedPostId] = useState<string | null>(null)

  // Fetch blog posts when locale changes
  useEffect(() => {
    getBlogPosts(activeLocale)
  }, [activeLocale, getBlogPosts]) // Added getBlogPosts to dependency array

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
```

<change file="src/app/(admin)/admin/sections/banners/banner-list.tsx" />

```typescript
'use client'

import {  useEffect, useState } from 'react'
import useAdminBanners from '@/hooks/admin/useAdminBanners'
import { Banner } from '@/domain/models/banner.model'
import { Locale } from '@/i18n'
import logger from '@/lib/logger'
import { BannerForm } from './components/banner-form'

export function BannerList() {
  const {
    banners,
    createBanner,
    updateBanner,
    deleteBanner,
    error,
    loading,
    getBanners // Destructure getBanners
  } = useAdminBanners()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Fetch banners when locale changes
  useEffect(() => {
    getBanners(activeLocale)
  }, [activeLocale, getBanners]) // Added getBanners to dependency array

  const handleCreate = async (data: Partial<Banner>) => {
    try {
      await createBanner(data, activeLocale)
      setIsCreating(false)
    } catch (error) {
      logger.log('Failed to create banner:', error)
    }
  }


  const handleUpdate = async (data: Partial<Banner>) => {
    if (!editingBanner) return
    try {
      await updateBanner(editingBanner.id, data, activeLocale)
      setEditingBanner(null)
    } catch (error) {
      logger.log('Failed to update banner:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner(id, activeLocale)
      } catch (error) {
        logger.log('Failed to delete banner:', error)
      }
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
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          Add Banner
        </button>
      </div>

      {(isCreating || editingBanner) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white   p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-[32px] font-medium tracking-[-0.02em] text-gray-900 mb-8">
              {editingBanner ? 'Edit Banner' : 'New Banner'}
            </h3>
            <BannerForm
              banner={editingBanner ?? undefined}
              locale={activeLocale}
              onSubmit={editingBanner ? handleUpdate : handleCreate}
              onCancel={() => {
                setEditingBanner(null)
                setIsCreating(false)
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white   shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtitle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Is Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {banners[activeLocale].map((banner) => (
              <tr key={banner.id} className={loading ? 'opacity-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {banner.title.slice(0, 30)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{banner.content.slice(0, 30)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{banner.subtitle?.slice(0, 30)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{banner.isActive ? 'Yes' : 'No'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => setEditingBanner(banner)}
                    className="text-primary hover:text-primary/90 disabled:opacity-50"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
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
```

<change file="src/app/(admin)/admin/sections/services/service-list.tsx" />

```typescript
"use client";

'use client'

import { useEffect, useState } from 'react'
import { Locale } from '@/i18n'
import { useRouter } from 'next/navigation'
import ListItemSkeleton from '@/components/ui/skeletons/list-item-skeleton'
import logger from '@/lib/logger'
import useAdminServices from '@/hooks/admin/useAdminServices';

export function ServiceList() {
  const { services, deleteService, error, loading, getServices } = useAdminServices()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const router = useRouter()

  // Fetch services when locale changes
  useEffect(() => {
    getServices(activeLocale)
  }, [activeLocale, getServices]) // Added getServices to dependency array

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        logger.log(`Deleting service with id: ${id} and locale  and locale : ${activeLocale}`)
        await deleteService(id, activeLocale)
      } catch (error) {
        logger.log('Failed to delete service:', error)
      }
    }
  }

  return (
    <div className="space-y-8">
      {error && <div className="p-4 bg-red-50 text-red-600  ">{error}</div>}

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveLocale('en')}
            className={`px-6 py-3 rounded-full transition-colors ${activeLocale === 'en'
              ? 'bg-primary text-white'
              : 'bg-secondary text-gray-700 hover:bg-secondary/80'
              }`}
          >
            English
          </button>
          <button
            onClick={() => setActiveLocale('pl')}
            className={`px-6 py-3 rounded-full transition-colors ${activeLocale === 'pl'
              ? 'bg-primary text-white'
              : 'bg-secondary text-gray-700 hover:bg-secondary/80'
              }`}
          >
            Polish
          </button>
        </div>
        <button
          onClick={() => router.push(`/admin/sections/services/create`)}
          className="px-6 py-3 text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          Add Service
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
                Published Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={7}>
                      <ListItemSkeleton />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              services[activeLocale]?.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {service.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">/services/{service.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {service.excerpt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {service.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/sections/services/edit/${service.id}?locale=${activeLocale}`
                        )
                      }
                      className="text-primary hover:text-primary/90 disabled:opacity-50"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

<change file="src/app/(admin)/admin/sections/case-study-sliders/sliders-list.tsx" />

```typescript
'use client'

import {  useEffect, useState } from 'react'
import useAdminCaseStudySliders from '@/hooks/admin/useAdminCaseStudySliders'
import { CaseStudySlider } from '@/domain/models/case-study-slider.model'

import logger from '@/lib/logger'
import { CaseStudySliderForm } from './components/slider-form'

export function CaseStudySliderList() {
  const {
    caseStudySliders,
    createCaseStudySlider,
    updateCaseStudySlider,
    deleteCaseStudySlider,
    error,
    loading,
    getCaseStudySliders // Destructure getCaseStudySliders
  } = useAdminCaseStudySliders()
  const [editingCaseStudySlider, setEditingCaseStudySlider] =
    useState<CaseStudySlider | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Fetch case study sliders on component mount
  useEffect(() => {
    getCaseStudySliders()
  }, [getCaseStudySliders]) // Added getCaseStudySliders to dependency array


  const handleCreate = async (data: Partial<CaseStudySlider>) => {
    try {
      await createCaseStudySlider(data)
      setIsCreating(false)
    } catch (error) {
      logger.log('Failed to create case study slider:', error)
    }
  }

  const handleUpdate = async (data: Partial<CaseStudySlider>) => {
    if (!editingCaseStudySlider) return
    try {
      await updateCaseStudySlider(editingCaseStudySlider.id, data)
      setEditingCaseStudySlider(null)
    } catch (error) {
      logger.log('Failed to update case study slider:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this case study slider?')) {
      try {
        console.log('deleting case study slider', id)
        await deleteCaseStudySlider(id)
      } catch (error) {
        logger.log('Failed to delete case study slider:', error)
      }
    }
  }

  return (
    <div className="space-y-8">
      {error && <div className="p-4 bg-red-50 text-red-600  ">{error}</div>}

      <div className="flex justify-between items-center">
        <div className="flex space-x-4"></div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          Add Case Study Slider
        </button>
      </div>

      {(isCreating || editingCaseStudySlider) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white   p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-[32px] font-medium tracking-[-0.02em] text-gray-900 mb-8">
              {editingCaseStudySlider
                ? 'Edit Case Study Slider'
                : 'New Case Study Slider'}
            </h3>
            <CaseStudySliderForm
              caseStudySlider={editingCaseStudySlider ?? undefined}
              onSubmit={editingCaseStudySlider ? handleUpdate : handleCreate}
              onCancel={() => {
                setEditingCaseStudySlider(null)
                setIsCreating(false)
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white   shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slider ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {caseStudySliders && Array.isArray(caseStudySliders) ? (
              caseStudySliders?.map((slider) => (
                <tr key={slider.id} className={loading ? 'opacity-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {slider.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => setEditingCaseStudySlider(slider)}
                      className="text-primary hover:text-primary/90 disabled:opacity-50"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slider.id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-4 whitespace-nowrap text-center"
                >
                  No case study sliders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```