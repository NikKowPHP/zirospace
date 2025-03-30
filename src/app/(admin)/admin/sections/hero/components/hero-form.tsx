'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button/button'
import { HeroModel } from '@/domain/models/models'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Locale } from '@/i18n'

export function HeroForm({ 
  hero,
  locale,
  onSubmit,
  onCancel
}: { 
  hero: HeroModel | null
  locale: Locale
  onSubmit: (data: Partial<HeroModel>, locale: Locale) => Promise<void>
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: hero?.title || '',
    subtitle: hero?.subtitle || '',
    background_image: hero?.background_image || ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (hero) {
      setFormData({
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        background_image: hero.background_image || ''
      })
    }
  }, [hero])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await onSubmit(formData, locale)
      toast.success('Hero section updated successfully')
      setLoading(false)
    } catch (error) {
      console.error('Failed to update hero section:', error)
      toast.error('Failed to update hero section')
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-lg font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-lg"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-lg font-medium text-gray-700">
          Subtitle
        </label>
        <input
          type="text"
          id="subtitle"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-lg"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="background_image" className="block text-lg font-medium text-gray-700">
          Background Image URL
        </label>
        <input
          type="text"
          id="background_image"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-lg"
          value={formData.background_image}
          onChange={(e) => setFormData({ ...formData, background_image: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  )
}