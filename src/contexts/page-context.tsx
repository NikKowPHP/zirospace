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
import { Banner } from '@/domain/models/banner.model'

interface PageContextType {
  caseStudies: Record<Locale, CaseStudy[]>
  caseStudySliders: CaseStudySlider[]
  testimonials: Record<Locale, Testimonial[]>
  activeBanner: Banner | null
  blogPost: BlogPost | null
  loading: boolean
  error: string | null
  clearError: () => void
  getTestimonials: (locale: Locale) => Promise<void>
  getCaseStudySliders: () => Promise<void>
  getBlogPost: (slug: string, locale: Locale) => Promise<void>
  getActiveBanner: (locale: Locale) => Promise<void>

}

interface PageProviderProps {
  children: React.ReactNode
  initialCaseStudies?: Record<Locale, CaseStudy[]>
  initialCaseStudySliders?: CaseStudySlider[]
  initialTestimonials?: Record<Locale, Testimonial[]>
  initialActiveBanner?: Banner
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export function PageProvider({
  children,
  initialCaseStudies,
  initialCaseStudySliders,
  initialTestimonials,
  initialActiveBanner,
}: PageProviderProps) {
  const [caseStudies, setCaseStudies] = useState<Record<Locale, CaseStudy[]>>(
    initialCaseStudies || { en: [], pl: [] }
  )
  const [caseStudySliders, setCaseStudySliders] = useState<CaseStudySlider[]>(
    initialCaseStudySliders || []
  )
  const [testimonials, setTestimonials] = useState<
    Record<Locale, Testimonial[]>
  >(initialTestimonials || { en: [], pl: [] })
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeBanner, setActiveBanner] = useState<Banner | null>(initialActiveBanner || null)
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
    if (initialActiveBanner) {
      setActiveBanner(initialActiveBanner)
    }
  }, [initialActiveBanner])

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
      const response = await fetch(`/api/admin/case-study-sliders`)
      if (!response.ok) {
        throw new Error('Failed to fetch case study sliders')
      }
      const data = await response.json()
      setCaseStudySliders(data)
    } catch (error: any) {
      setError(error.message || 'Failed to fetch case study sliders')
    } finally {
      setLoading(false)
    }
  }, [])

  const getBlogPost = useCallback(async (slug: string, locale: Locale) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/blog-post?slug=${slug}&locale=${locale}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blog post')
      }
      const data = await response.json()
      setBlogPost(data)
    } catch (error: any) {
      setError(error.message || 'Failed to fetch blog post')
    } finally {
      setLoading(false)
    }
  }, [])

  const getActiveBanner = useCallback(async (locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      // const response = await bannerService.getActiveBanner(locale)
      const response = await fetch(`/api/admin/banner?locale=${locale}`)
      if (!response.ok) {
        throw new Error('Failed to fetch active banner')
      }
      const data = await response.json()
      setActiveBanner(data)
    } catch (error: any) {
      setError(error.message || 'Failed to fetch active banner')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <PageContext.Provider
      value={{
        caseStudies,
        caseStudySliders,
        testimonials,
        blogPost,
        loading,
        error,
        clearError,
        getTestimonials,
        getCaseStudySliders,
        getBlogPost,
        activeBanner,
        getActiveBanner,
      }}
    >
      {children}
    </PageContext.Provider>
  )
}

export const usePage = () => {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error('usePage must be used within an PageProvider')
  }
  return context
}
