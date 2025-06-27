'use client'
import { useState, useEffect } from 'react'
import { YoutubeForm } from './components/youtube-form'
import { YoutubeModel } from '@/domain/models/models'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import logger from '@/lib/logger'

export default function YoutubeAdminPage() {
  const [youtubeSection, setYoutubeSection] = useState<YoutubeModel | null>(
    null
  )
  const [loading, setLoading] = useState(false)

  const fetchYoutubeSection = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/youtube`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setYoutubeSection(data)
    } catch (error) {
      toast.error('Failed to fetch YouTube section')
      logger.error('Failed to fetch YouTube section', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: Partial<YoutubeModel>) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/youtube`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtube_url: data.youtube_url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        )
      }

      const updatedYoutube = await response.json()
      setYoutubeSection(updatedYoutube)
      toast.success('YouTube section updated successfully')
    } catch (error) {
      logger.error('Failed to update YouTube section', error)
      toast.error(
        `Failed to update YouTube section: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchYoutubeSection()
  }, [])

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold mb-6">Youtube Sections Management</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <YoutubeForm
            youtube={youtubeSection}
            onSubmit={handleSubmit}
            onCancel={fetchYoutubeSection}
          />
        )}
      </div>
    </div>
  )
}
