'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button/button'
import { YoutubeModel } from '@/domain/models/models'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface YoutubeFormProps {
  youtube: YoutubeModel | null
  onSubmit: (data: Partial<YoutubeModel>) => Promise<void>
  onCancel: () => Promise<void>
}

export function YoutubeForm({ youtube, onSubmit, onCancel }: YoutubeFormProps) {
  const [youtube_url, setYoutubeUrl] = useState(youtube?.youtube_url || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (youtube) {
      setYoutubeUrl(youtube.youtube_url || '')
    }
  }, [youtube])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ youtube_url })
      toast.success('YouTube URL updated successfully')
    } catch (error) {
      toast.error(
        `Failed to update YouTube: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="youtube_url"
          className="block text-lg font-medium text-gray-700"
        >
          Youtube URL
        </label>
        <input
          type="text"
          id="youtube_url"
          className="mt-1 block w-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-lg"
          value={youtube_url}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
