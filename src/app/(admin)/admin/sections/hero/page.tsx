'use client'

import { useState, useEffect } from 'react'
import { HeroForm } from './components/hero-form'
import { Locale } from '@/i18n'
import { HeroModel } from '@/domain/models/models'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import logger from '@/lib/logger'

export default function HeroAdminPage() {
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [heroSection, setHeroSection] = useState<HeroModel | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchHeroSection = async (locale: Locale) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/hero?locale=${locale}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setHeroSection(data)
    } catch (error) {
      toast.error('Failed to fetch hero section')
      logger.error('Failed to fetch hero section', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLocaleChange = (locale: Locale) => {
    setActiveLocale(locale)
    fetchHeroSection(locale)
  }

  const handleSubmit = async (data: Partial<HeroModel>, locale: Locale) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: heroSection?.id, data, locale }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        )
      }

      const updatedHero = await response.json()
      setHeroSection(updatedHero)
      toast.success('Hero section updated successfully')
    } catch (error) {
      logger.error('Failed to update hero section', error)
      toast.error(
        `Failed to update hero section: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchHeroSection(activeLocale)
  }, [activeLocale]) // Added activeLocale to dependency array

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Hero Section Management</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleLocaleChange('en')}
              className={`px-6 py-3 rounded-full transition-colors ${
                activeLocale === 'en'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-gray-700 hover:bg-secondary/80'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLocaleChange('pl')}
              className={`px-6 py-3 rounded-full transition-colors ${
                activeLocale === 'pl'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-gray-700 hover:bg-secondary/80'
              }`}
            >
              Polish
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <HeroForm
            hero={heroSection}
            locale={activeLocale}
            onSubmit={handleSubmit}
            onCancel={() => fetchHeroSection(activeLocale)}
          />
        )}
      </div>
    </div>
  )
}
