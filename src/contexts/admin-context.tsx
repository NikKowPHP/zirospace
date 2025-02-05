'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { CaseStudy } from '@/domain/models/case-study.model'
import { Locale } from '@/i18n'

interface AdminContextType {
  caseStudies: Record<Locale, CaseStudy[]>
  loading: boolean
  error: string | null
  createCaseStudy: (data: Partial<CaseStudy>, locale: Locale) => Promise<void>
  updateCaseStudy: (id: string, data: Partial<CaseStudy>, locale: Locale) => Promise<void>
  deleteCaseStudy: (id: string, locale: Locale) => Promise<void>
  clearError: () => void
}

interface AdminProviderProps {
  children: React.ReactNode
  initialCaseStudies?: Record<Locale, CaseStudy[]>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children, initialCaseStudies }: AdminProviderProps) {
  const [caseStudies, setCaseStudies] = useState<Record<Locale, CaseStudy[]>>(
    initialCaseStudies || { en: [], pl: [] }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize case studies when initialCaseStudies changes
  useEffect(() => {
    if (initialCaseStudies) {
      setCaseStudies(initialCaseStudies)
    }
  }, [initialCaseStudies])

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

  const clearError = () => setError(null)

  return (
    <AdminContext.Provider value={{
      caseStudies,
      loading,
      error,
      createCaseStudy,
      updateCaseStudy,
      deleteCaseStudy,
      clearError
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