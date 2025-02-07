'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { CaseStudy } from '@/domain/models/case-study.model'
import { Locale } from '@/i18n'
import { CaseStudySlider } from '@/domain/models/case-study-slider.model'
import { Testimonial } from '@/domain/models/testimonial.model'

interface AdminContextType {
  caseStudies: Record<Locale, CaseStudy[]>
  caseStudySliders: Record<Locale, CaseStudySlider[]>
  testimonials: Record<Locale, Testimonial[]>
  loading: boolean
  error: string | null
  createCaseStudy: (data: Partial<CaseStudy>, locale: Locale) => Promise<void>
  updateCaseStudy: (id: string, data: Partial<CaseStudy>, locale: Locale) => Promise<void>
  deleteCaseStudy: (id: string, locale: Locale) => Promise<void>
  createCaseStudySlider: (data: Partial<CaseStudySlider>, locale: Locale) => Promise<void>
  updateCaseStudySlider: (id: string, data: Partial<CaseStudySlider>, locale: Locale) => Promise<void>
  deleteCaseStudySlider: (id: string, locale: Locale) => Promise<void>
  createTestimonial: (data: Partial<Testimonial>, locale: Locale) => Promise<void>
  updateTestimonial: (id: string, data: Partial<Testimonial>, locale: Locale) => Promise<void>
  deleteTestimonial: (id: string, locale: Locale) => Promise<void>
  clearError: () => void
  getTestimonials: (locale: Locale) => Promise<void>
}

interface AdminProviderProps {
  children: React.ReactNode
  initialCaseStudies?: Record<Locale, CaseStudy[]>
  initialCaseStudySliders?: Record<Locale, CaseStudySlider[]>
  initialTestimonials?: Record<Locale, Testimonial[]>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({
  children,
  initialCaseStudies,
  initialCaseStudySliders,
  initialTestimonials
}: AdminProviderProps) {
  const [caseStudies, setCaseStudies] = useState<Record<Locale, CaseStudy[]>>(
    initialCaseStudies || { en: [], pl: [] }
  )
  const [caseStudySliders, setCaseStudySliders] = useState<Record<Locale, CaseStudySlider[]>>(
    initialCaseStudySliders || { en: [], pl: [] }
  )
  const [testimonials, setTestimonials] = useState<Record<Locale, Testimonial[]>>(
    initialTestimonials || { en: [], pl: [] }
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
        const errorData = await response.json().catch(() => ({ error: 'Failed to create case study' }))
        throw new Error(errorData.error || 'Failed to create case study')
      }

      const newCaseStudy = await response.json()
      setCaseStudies(prev => ({
        ...prev,
        [locale]: [...prev[locale], newCaseStudy]
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create case study')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCaseStudy = async (id: string, data: Partial<CaseStudy>, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      console.log('update data', data)
      const response = await fetch(`/api/admin/case-studies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update case study' }))
        throw new Error(errorData.error || 'Failed to update case study')
      }

      const updatedCaseStudy = await response.json()
      console.log('updatedCaseStudy', updatedCaseStudy)
      setCaseStudies(prev => ({
        ...prev,
        [locale]: prev[locale].map(cs => cs.id === id ? updatedCaseStudy : cs)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update case study')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCaseStudy = async (id: string, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
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
      setCaseStudies(prev => ({
        ...prev,
        [locale]: prev[locale].filter(cs => cs.id !== id)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete case study')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createCaseStudySlider = async (data: Partial<CaseStudySlider>, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/case-study-sliders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create case study slider' }))
        throw new Error(errorData.error || 'Failed to create case study slider')
      }

      const newCaseStudySlider = await response.json()
      setCaseStudySliders(prev => ({
        ...prev,
        [locale]: [...prev[locale], newCaseStudySlider]
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create case study slider')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCaseStudySlider = async (id: string, data: Partial<CaseStudySlider>, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/case-study-sliders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update case study slider' }))
        throw new Error(errorData.error || 'Failed to update case study slider')
      }

      const updatedCaseStudySlider = await response.json()
      setCaseStudySliders(prev => ({
        ...prev,
        [locale]: prev[locale].map(cs => cs.id === id ? updatedCaseStudySlider : cs)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update case study slider')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCaseStudySlider = async (id: string, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/case-study-sliders/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete case study slider')
      }
      
      setCaseStudySliders(prev => ({
        ...prev,
        [locale]: prev[locale].filter(cs => cs.id !== id)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete case study slider')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createTestimonial = async (data: Partial<Testimonial>, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create testimonial' }))
        throw new Error(errorData.error || 'Failed to create testimonial')
      }

      const newTestimonial = await response.json()
      setTestimonials(prev => ({
        ...prev,
        [locale]: [...prev[locale], newTestimonial]
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create testimonial')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTestimonial = async (id: string, data: Partial<Testimonial>, locale: Locale) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, locale }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update testimonial' }))
        throw new Error(errorData.error || 'Failed to update testimonial')
      }

      const updatedTestimonial = await response.json()
      setTestimonials(prev => ({
        ...prev,
        [locale]: prev[locale].map(cs => cs.id === id ? updatedTestimonial : cs)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update testimonial')
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
      
      setTestimonials(prev => ({
        ...prev,
        [locale]: prev[locale].filter(cs => cs.id !== id)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  const getTestimonials = async (locale: Locale) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/testimonials?locale=${locale}`);
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      const data = await response.json();
      setTestimonials(prev => ({ ...prev, [locale]: data }));
    } catch (error: any) {
      setError(error.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{
      caseStudies,
      caseStudySliders,
      testimonials,
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
      clearError,
      getTestimonials
    }}>
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