'use client'

import { useState } from 'react'
import { Locale } from '@/i18n'
import { Testimonial } from '@/domain/models/testimonial.model'
import { Button } from '@/components/ui/button/button'

interface TestimonialFormProps {
  testimonial?: Testimonial
  locale: Locale
  onSubmit: (data: Partial<Testimonial>) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function TestimonialForm({
  testimonial,
  onSubmit,
  onCancel,
  loading,
}: TestimonialFormProps) {
  const [author, setAuthor] = useState(testimonial?.author || '')
  const [role, setRole] = useState(testimonial?.role || '')
  const [company, setCompany] = useState(testimonial?.company || '')
  const [quote, setQuote] = useState(testimonial?.quote || '')
  const [image, setImage] = useState(testimonial?.image || '')
  const [image_alt, setImageAlt] = useState(testimonial?.image_alt || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ author, role, company, quote, image, image_alt })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="author"
          className="block text-sm font-medium text-gray-700"
        >
          Author
        </label>
        <input
          type="text"
          id="author"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <input
          type="text"
          id="role"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-gray-700"
        >
          Company
        </label>
        <input
          type="text"
          id="company"
          className="mt-1 block w-full   border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="quote"
          className="block text-sm font-medium text-gray-700"
        >
          Quote
        </label>
        <textarea
          id="quote"
          rows={3}
          className="mt-1 block w-full   border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <input
          type="text"
          id="image"
          className="mt-1 block w-full   border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="image_alt"
          className="block text-sm font-medium text-gray-700"
        >
          Image Alt Text
        </label>
        <input
          type="text"
          id="image_alt"
          className="mt-1 block w-full   border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={image_alt}
          onChange={(e) => setImageAlt(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {testimonial ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
