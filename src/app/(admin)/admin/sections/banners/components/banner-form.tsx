'use client'

import { Banner } from '@/domain/models/banner.model'
import { Locale } from '@/i18n'
import { useState } from 'react'

interface BannerFormProps {
  banner?: Banner
  locale: Locale
  onSubmit: (data: Partial<Banner>) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function BannerForm({
  banner,
  locale,
  onSubmit,
  onCancel,
  loading,
}: BannerFormProps) {
  const [title, setTitle] = useState(banner?.title || '')
  const [content, setContent] = useState(banner?.content || '')
  const [subtitle, setSubtitle] = useState(banner?.subtitle || '')
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl || '')
  const [youtubeUrl, setYoutubeUrl] = useState(banner?.youtubeUrl || '')
  const [startDate, setStartDate] = useState<Date | undefined>(banner?.startDate ? new Date(banner.startDate) : undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(banner?.endDate ? new Date(banner.endDate) : undefined)
  const [isActive, setIsActive] = useState(banner?.isActive || false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    await onSubmit({
      id: banner?.id || '',
      title: title,
      content: content,
      subtitle: subtitle,
      imageUrl: imageUrl,
      youtubeUrl: youtubeUrl,
      startDate: startDate,
      endDate: endDate,
      isActive: isActive,
      createdAt: banner?.createdAt,
      updatedAt: new Date(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title ({locale}) *
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content ({locale})
        </label>
        <textarea
          id="content"
          name="content"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="subtitle"
          className="block text-sm font-medium text-gray-700"
        >
          Subtitle ({locale})
        </label>
        <input
          type="text"
          name="subtitle"
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL ({locale})
        </label>
        <input
          type="text"
          name="imageUrl"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="youtubeUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Youtube URL
        </label>
        <input
          type="text"
          name="youtubeUrl"
          id="youtubeUrl"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date ({locale})
        </label>
        <input
          type="date"
          name="startDate"
          id="startDate"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="endDate"
          className="block text-sm font-medium text-gray-700"
        >
          End Date ({locale})
        </label>
        <input
          type="date"
          name="endDate"
          id="endDate"
          value={endDate ? endDate.toISOString().split('T')[0] : ''}
          onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="isActive"
          className="block text-sm font-medium text-gray-700"
        >
          Is Active
        </label>
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="mt-1 h-10 w-10 rounded border-gray-300 text-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors"
          disabled={loading || !title.trim()}
        >
          {loading ? 'Saving...' : banner ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
