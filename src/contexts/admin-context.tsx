'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { CaseStudy } from '@/domain/models/case-study.model'
import { Locale } from '@/i18n'
import { CaseStudySlider } from '@/domain/models/case-study-slider.model'
import { Testimonial } from '@/domain/models/testimonial.model'
import { BlogPost } from '@/domain/models/blog-post.model'
import logger from '@/lib/logger'
import { Banner } from '@/domain/models/banner.model'

interface AdminContextType {
  caseStudies: Record<Locale, CaseStudy[]>
  caseStudySliders: CaseStudySlider[]
  testimonials: Record<Locale, Testimonial[]>
  blogPosts: Record<Locale, BlogPost[]>
  banners: Record<Locale, Banner[]>
  loading: boolean
  error: string | null
  createCaseStudy: (data: Partial<CaseStudy>, locale: Locale) => Promise<void>
  updateCaseStudy: (
    id: string,
    data: Partial<CaseStudy>,
    locale: Locale
  ) => Promise<void>
  deleteCaseStudy: (id: string, locale: Locale) => Promise<void>

  createCaseStudySlider: (data: Partial<CaseStudySlider>) => Promise<void>
  updateCaseStudySlider: (
    id: string,
    data: Partial<CaseStudySlider>
  ) => Promise<void>
  deleteCaseStudySlider: (id: string) => Promise<void>

  createTestimonial: (
    data: Partial<Testimonial>,
    locale: Locale
  ) => Promise<void>
  updateTestimonial: (
    id: string,
    data: Partial<Testimonial>,
    locale: Locale
  ) => Promise<void>
  deleteTestimonial: (id: string, locale: Locale) => Promise<void>

  createBlogPost: (data: Partial<BlogPost>, locale: Locale) => Promise<void>
  updateBlogPost: (
    id: string,
    data: Partial<BlogPost>,
    locale: string
  ) => Promise<void>
  deleteBlogPost: (id: string, locale: Locale) => Promise<void>
  pinBlogPost: (id: string, locale: Locale) => Promise<void>

  createBanner: (data: Partial<Banner>, locale: Locale) => Promise<void>
  updateBanner: (
    id: string,
    data: Partial<Banner>,
    locale: Locale
  ) => Promise<void>
  deleteBanner: (id: string, locale: Locale) => Promise<void>

  clearError: () => void
  getTestimonials: (locale: Locale) => Promise<void>
  getCaseStudySliders: () => Promise<void>
  getBlogPosts: (locale: Locale) => Promise<void>
  getBlogPost: (id: string, locale: string) => Promise<BlogPost | null>
}

interface AdminProviderProps {
  children: React.ReactNode
  initialCaseStudies?: Record<Locale, CaseStudy[]>
  initialCaseStudySliders?: CaseStudySlider[]
  initialTestimonials?: Record<Locale, Testimonial[]>
  initialBlogPosts?: Record<Locale, BlogPost[]>
  initialBanners?: Record<Locale, Banner[]>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({
  children,
  initialCaseStudies,
  initialCaseStudySliders,
  initialTestimonials,
  initialBlogPosts,
  initialBanners,
}: AdminProviderProps) {
  const [caseStudies, setCaseStudies] = useState<Record<Locale, CaseStudy[]>>(
    initialCaseStudies || { en: [], pl: [] }
  )
  const [caseStudySliders, setCaseStudySliders] = useState<CaseStudySlider[]>(
    initialCaseStudySliders || []
  )
  const [testimonials, setTestimonials] = useState<
    Record<Locale, Testimonial[]>
  >(initialTestimonials || { en: [], pl: [] })
  const [blogPosts, setBlogPosts] = useState<Record<string, BlogPost[]>>(
    initialBlogPosts || { en: [], pl: [] }
  )
  const [banners, setBanners] = useState<Record<Locale, Banner[]>>(
    initialBanners || { en: [], pl: [] }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize case studies when initialCaseStudies changes
  useEffect(() => {
    if (initialCaseStudies) {
      setCaseStudies(initialCaseStudies)
    }
  }, [initialCaseStudies])

  useEffect(() => {
    if (initialCaseStudySliders) {
      setCaseStudySliders(initialCaseStudySliders)
    }
  }, [initialCaseStudySliders])

  useEffect(() => {
    if (initialTestimonials) {
      setTestimonials(initialTestimonials)
    }
  }, [initialTestimonials])

  useEffect(() => {
    if (initialBlogPosts) {
      setBlogPosts(initialBlogPosts)
    }
  }, [initialBlogPosts])

  useEffect(() => {
    if (initialBanners) {
      setBanners(initialBanners)
    }
  }, [initialBanners])

  const createCaseStudy = async (data: Partial<CaseStudy>, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/case-studies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to create case study' }))
        throw new Error(errorData.error || 'Failed to create case study')
      }

      const newCaseStudy = await response.json()
      setCaseStudies((prev) => ({
        ...prev,
        [locale]: [...prev[locale], newCaseStudy],
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create case study'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCaseStudy = async (
    id: string,
    data: Partial<CaseStudy>,
    locale: Locale
  ) => {
    setLoading(true)
    setError(null)
    try {
      console.log('update data', { data, id})
      const response = await fetch(`/api/admin/case-studies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to update case study' }))
        throw new Error(errorData.error || 'Failed to update case study')
      }

      const updatedCaseStudy = await response.json()
      console.log('updatedCaseStudy', updatedCaseStudy)
      setCaseStudies((prev) => ({
        ...prev,
        [locale]: prev[locale].map((cs) =>
          cs.id === id ? updatedCaseStudy : cs
        ),
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update case study'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCaseStudy = async (id: string, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      console.log('deleting case study', id, locale)
      const response = await fetch(`/api/admin/case-studies/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete case study')
      }

      // Update state by removing deleted case study
      setCaseStudies((prev) => ({
        ...prev,
        [locale]: prev[locale].filter((cs) => cs.id !== id),
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete case study'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createCaseStudySlider = async (
    data: Partial<CaseStudySlider>
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/case-study-sliders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to create case study slider' }))
        throw new Error(errorData.error || 'Failed to create case study slider')
      }

      const newCaseStudySlider = await response.json()
      console.log('newCaseStudySlider', newCaseStudySlider)
      setCaseStudySliders((prev) => [...prev, newCaseStudySlider])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create case study slider'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCaseStudySlider = async (
    id: string,
    data: Partial<CaseStudySlider>
  ) => {
    setLoading(true)
    setError(null)
    try {
      console.log('updateCaseStudySlider', { id, data })
      const response = await fetch(`/api/admin/case-study-sliders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, id }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to update case study slider' }))
        throw new Error(errorData.error || 'Failed to update case study slider')
      }

      const updatedCaseStudySlider = await response.json()
      setCaseStudySliders((prev) =>
        prev.map((cs) => (cs.id === id ? updatedCaseStudySlider : cs))
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update case study slider'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCaseStudySlider = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      console.log('deleting case study slider', id)
      const response = await fetch(`/api/admin/case-study-sliders/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete case study slider')
      }

      setCaseStudySliders((prev) => prev.filter((cs) => cs.id !== id))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete case study slider'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createTestimonial = async (
    data: Partial<Testimonial>,
    locale: Locale
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to create testimonial' }))
        throw new Error(errorData.error || 'Failed to create testimonial')
      }

      const newTestimonial = await response.json()
      setTestimonials((prev) => ({
        ...prev,
        [locale]: [...prev[locale], newTestimonial],
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create testimonial'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTestimonial = async (
    id: string,
    data: Partial<Testimonial>,
    locale: Locale
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to update testimonial' }))
        throw new Error(errorData.error || 'Failed to update testimonial')
      }

      const updatedTestimonial = await response.json()
      setTestimonials((prev) => ({
        ...prev,
        [locale]: prev[locale].map((cs) =>
          cs.id === id ? updatedTestimonial : cs
        ),
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update testimonial'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTestimonial = async (id: string, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete testimonial')
      }

      setTestimonials((prev) => ({
        ...prev,
        [locale]: prev[locale].filter((cs) => cs.id !== id),
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete testimonial'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createBlogPost = async (data: Partial<BlogPost>, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/blog-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to create blog post' }))
        throw new Error(errorData.error || 'Failed to create blog post')
      }

      const newBlogPost = await response.json()
      setBlogPosts((prev) => ({
        ...prev,
        [locale]: [...prev[locale], newBlogPost],
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create blog post'
      )
      logger.error(`Failed to create blog post ${err}`)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBlogPost = async (
    id: string,
    data: Partial<BlogPost>,
    locale: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      console.log('updateBlogPost', {data, locale})
      const response = await fetch(`/api/admin/blog-post?id=${id}&locale=${locale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update blog post')
      }

      const updatedBlogPost = await response.json()
      setBlogPosts((prev) => ({
        ...prev,
        [locale]: prev[locale].map((bp) =>
          bp.id === id ? updatedBlogPost : bp
        ),
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update blog post'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteBlogPost = async (id: string, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      console.log('perfoming delete', id, locale)
      const response = await fetch(`/api/admin/blog-post?id=${id}&locale=${locale}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete blog post')
      }

      setBlogPosts((prev) => ({
        ...prev,
        [locale]: prev[locale].filter((cs) => cs.id !== id),
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete blog post'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const pinBlogPost = async (id: string, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/blog-post/pin?id=${id}&locale=${locale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to pin blog post')
      }

      const updatedBlogPost = await response.json()
      setBlogPosts((prev) => ({
        ...prev,
        [locale]: prev[locale].map((bp) =>
          bp.id === id ? updatedBlogPost : bp
        ),
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to pin blog post'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createBanner = async (data: Partial<Banner>, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to create banner' }))
        throw new Error(errorData.error || 'Failed to create banner')
      }

      const newBanner = await response.json()
      setBanners((prev) => ({
        ...prev,
        [locale]: [...prev[locale], newBanner],
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create banner'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBanner = async (
    id: string,
    data: Partial<Banner>,
    locale: Locale
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to update banner' }))
        throw new Error(errorData.error || 'Failed to update banner')
      }

      const updatedBanner = await response.json()
      setBanners((prev) => ({
        ...prev,
        [locale]: prev[locale].map((banner) =>
          banner.id === id ? updatedBanner : banner
        ),
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update banner'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteBanner = async (id: string, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete banner')
      }

      setBanners((prev) => ({
        ...prev,
        [locale]: prev[locale].filter((banner) => banner.id !== id),
      }))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete banner'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  const getTestimonials = useCallback(async (locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/testimonials?locale=${locale}`)
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials')
      }
      const data = await response.json()
      setTestimonials((prev) => ({ ...prev, [locale]: data }))
    } catch (error: any) {
      setError(error.message || 'Failed to fetch testimonials')
    } finally {
      setLoading(false)
    }
  }, [])

  const getCaseStudySliders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('fetching case study sliders')
      const response = await fetch(`/api/admin/case-study-sliders`)
      if (!response.ok) {
        throw new Error('Failed to fetch case study sliders')
      }
     
      const data = await response.json()
      console.log('case study sliders data', data)
      setCaseStudySliders(data)
    } catch (error: any) {
      setError(error.message || 'Failed to fetch case study sliders')
    } finally {
      setLoading(false)
    }
  }, [])

  const getBlogPosts = useCallback(async (locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/blog-posts?locale=${locale}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts')
      }
      const data = await response.json()
      setBlogPosts((prev) => ({ ...prev, [locale]: data }))
    } catch (error: any) {
      setError(error.message || 'Failed to fetch blog posts')
    } finally {
      setLoading(false)
    }
  }, [])

  const getBlogPost = useCallback(async (id: string, locale: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/blog-post?id=${id}&locale=${locale}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blog post')
      }
      const data = await response.json()
      return data
    } catch (error: any) {
      setError(error.message || 'Failed to fetch blog post')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <AdminContext.Provider
      value={{
        caseStudies,
        caseStudySliders,
        testimonials,
        blogPosts,
        banners,
        loading,
        error,
        createCaseStudy,
        updateCaseStudy,
        deleteCaseStudy,
        createCaseStudySlider,
        updateCaseStudySlider,
        deleteCaseStudySlider,
        createTestimonial,
        updateTestimonial,
        deleteTestimonial,
        createBlogPost,
        updateBlogPost,
        deleteBlogPost,
        pinBlogPost,
        createBanner,
        updateBanner,
        deleteBanner,
        clearError,
        getTestimonials,
        getCaseStudySliders,
        getBlogPosts,
        getBlogPost,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
