'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button/button'
import { YoutubeModel} from '@/domain/models/models'

export function YoutubeForm({youtube, handleUpdate}: {youtube: YoutubeModel | null, handleUpdate: (youtube: Partial<YoutubeModel>) => void}) {

  const [youtube_url, setYoutubeUrl] = useState(youtube?.youtube_url || '')

  useEffect(() => {
    if (youtube) {
      setYoutubeUrl(youtube.youtube_url || '')
    }
  }, [youtube])

  console.log('youtubeSection fetched on form', youtube)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
        handleUpdate({ youtube_url, id: youtube?.id })
    } catch (error) {
      console.error('Failed to update YouTube:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div>
      </div>
       
      <div className="flex justify-end space-x-4">
        <Button variant="primary" type="submit">
          Update
        </Button>
      </div>
    </form>
  )
}
