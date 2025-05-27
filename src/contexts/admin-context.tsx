// src/contexts/admin-context.tsx
'use client'

import { Service } from '@/domain/models/service.model';
import { useRouter } from 'next/navigation';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { CaseStudy } from '@/domain/models/models'
import { Locale } from '@/i18n'
import { CaseStudySlider } from '@/domain/models/case-study-slider.model'
import { Testimonial } from '@/domain/models/testimonial.model'
import { BlogPost } from '@/domain/models/blog-post.model'
import { Banner } from '@/domain/models/banner.model'
import toast from 'react-hot-toast'
import useAdminCaseStudies from '@/hooks/admin/useAdminCaseStudies';
import useAdminBlogPosts from '@/hooks/admin/useAdminBlogPosts';
import useAdminBanners from '@/hooks/admin/useAdminBanners';
import useAdminServices from '@/hooks/admin/useAdminServices';
import useAdminTestimonials from '@/hooks/admin/useAdminTestimonials';
import useAdminCaseStudySliders from '@/hooks/admin/useAdminCaseStudySliders';

interface OrderUpdate {
  id: string
  order: number
}

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
  const router = useRouter();
  const {
    caseStudies,
    loading: caseStudiesLoading,
    error: caseStudiesError,
    getCaseStudies,
    createCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    updateCaseStudyOrder,
    clearError: clearCaseStudiesError,
  } = useAdminCaseStudies({ initialCaseStudies });

  const {
    blogPosts,
    loading: blogPostsLoading,
    error: blogPostsError,
    getBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    pinBlogPost,
    clearError: clearBlogPostsError,
  } = useAdminBlogPosts({ initialBlogPosts });

  const {
    banners,
    loading: bannersLoading,
    error: bannersError,
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    clearError: clearBannersError,
  } = useAdminBanners({ initialBanners });

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    clearError: clearServicesError,
  } = useAdminServices({ initialServices });

  const {
    testimonials,
    loading: testimonialsLoading,
    error: testimonialsError,
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    clearError: clearTestimonialsError,
  } = useAdminTestimonials({ initialTestimonials });

  const {
    caseStudySliders,
    loading: caseStudySlidersLoading,
    error: caseStudySlidersError,
    getCaseStudySliders,
    createCaseStudySlider,
    updateCaseStudySlider,
    deleteCaseStudySlider,
    clearError: clearCaseStudySlidersError,
  } = useAdminCaseStudySliders({ initialCaseStudySliders });

  const loading =
    caseStudiesLoading ||
    blogPostsLoading ||
    bannersLoading ||
    servicesLoading ||
    testimonialsLoading ||
    caseStudySlidersLoading;

  const error =
    caseStudiesError ||
    blogPostsError ||
    bannersError ||
    servicesError ||
    testimonialsError ||
    caseStudySlidersError;

  const clearError = useCallback(() => {
    clearCaseStudiesError();
    clearBlogPostsError();
    clearBannersError();
    clearServicesError();
    clearTestimonialsError();
    clearCaseStudySlidersError();
  }, [
    clearCaseStudiesError,
    clearBlogPostsError,
    clearBannersError,
    clearServicesError,
    clearTestimonialsError,
    clearCaseStudySlidersError,
  ]);

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
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within a AdminProvider');
  }
  return context;
}
