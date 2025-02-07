'use client'

import { useState } from 'react'
import { Locale } from '@/i18n'
import { Button } from '@/components/ui/button/button'
import { CaseStudySlider } from '@/domain/models/case-study-slider.model'

interface CaseStudySliderFormProps {
  caseStudySlider?: CaseStudySlider
  locale: Locale
  onSubmit: (data: Partial<CaseStudySlider>) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function CaseStudySliderForm({
  caseStudySlider,
  locale,
  onSubmit,
  onCancel,
  loading
}: CaseStudySliderFormProps) {
  const [theme, setTheme] = useState(caseStudySlider?.theme || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ theme })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
          Theme
        </label>
        <input
          type="text"
          id="theme"
          className="mt-1 block w-full rounded-primary border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {caseStudySlider ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}