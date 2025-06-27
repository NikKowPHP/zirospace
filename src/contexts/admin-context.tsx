'use client'
import { createContext, useContext, useCallback } from 'react'
import {
  Banner,
  BlogPost,
  CaseStudy,
  CaseStudySlider,
  Service,
  Testimonial,
} from '@/domain/models/models'
import { Locale } from '@/i18n'

import useAdminCaseStudies from '@/hooks/admin/useAdminCaseStudies'
import useAdminBlogPosts from '@/hooks/admin/useAdminBlogPosts'
import useAdminBanners from '@/hooks/admin/useAdminBanners'
import useAdminServices from '@/hooks/admin/useAdminServices'
import useAdminTestimonials from '@/hooks/admin/useAdminTestimonials'
import useAdminCaseStudySliders from '@/hooks/admin/useAdminCaseStudySliders'

interface AdminContextType {
  loading: boolean
  error: string | null
  clearError: () => void
}

interface AdminProviderProps {
  children: React.ReactNode
  initialCaseStudies?: Record<Locale, CaseStudy[]>
  initialCaseStudySliders?: CaseStudySlider[]
  initialTestimonials?: Record<Locale, Testimonial[]>
  initialBlogPosts?: Record<Locale, BlogPost[]>
  initialBanners?: Record<Locale, Banner[]>
  initialServices?: Record<Locale, Service[]>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({
  children,
  initialCaseStudies,
  initialCaseStudySliders,
  initialTestimonials,
  initialBlogPosts,
  initialBanners,
  initialServices,
}: AdminProviderProps) {
  const {
    loading: caseStudiesLoading,
    error: caseStudiesError,
    clearError: clearCaseStudiesError,
  } = useAdminCaseStudies({ initialCaseStudies })

  const {
    loading: blogPostsLoading,
    error: blogPostsError,
    clearError: clearBlogPostsError,
  } = useAdminBlogPosts({ initialBlogPosts })

  const {
    loading: bannersLoading,
    error: bannersError,
    clearError: clearBannersError,
  } = useAdminBanners({ initialBanners })

  const {
    loading: servicesLoading,
    error: servicesError,
    clearError: clearServicesError,
  } = useAdminServices({ initialServices })

  const {
    loading: testimonialsLoading,
    error: testimonialsError,
    clearError: clearTestimonialsError,
  } = useAdminTestimonials({ initialTestimonials })

  const {
    loading: caseStudySlidersLoading,
    error: caseStudySlidersError,
    clearError: clearCaseStudySlidersError,
  } = useAdminCaseStudySliders({ initialCaseStudySliders })

  const loading =
    caseStudiesLoading ||
    blogPostsLoading ||
    bannersLoading ||
    servicesLoading ||
    testimonialsLoading ||
    caseStudySlidersLoading

  const error =
    caseStudiesError ||
    blogPostsError ||
    bannersError ||
    servicesError ||
    testimonialsError ||
    caseStudySlidersError

  const clearError = useCallback(() => {
    clearCaseStudiesError()
    clearBlogPostsError()
    clearBannersError()
    clearServicesError()
    clearTestimonialsError()
    clearCaseStudySlidersError()
  }, [
    clearCaseStudiesError,
    clearBlogPostsError,
    clearBannersError,
    clearServicesError,
    clearTestimonialsError,
    clearCaseStudySlidersError,
  ])

  return (
    <AdminContext.Provider
      value={{
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within a AdminProvider')
  }
  return context
}
