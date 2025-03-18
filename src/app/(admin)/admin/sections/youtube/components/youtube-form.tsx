'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button/button'
import { YoutubeModel} from '@/domain/models/models'
import { updateYoutubeAction } from '../actions/action'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function YoutubeForm({youtube}: {youtube: YoutubeModel | null}) {

  const [youtube_url, setYoutubeUrl] = useState(youtube?.youtube_url || '')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (youtube) {
      setYoutubeUrl(youtube.youtube_url || '')
    }
  }, [youtube])

  console.log('youtubeSection fetched on form', youtube)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const result = await updateYoutubeAction({ youtube_url, id: youtube?.id })
      console.log('updateYoutubeAction result', result)
      setYoutubeUrl(result?.youtube_url || '')
      toast.success('Youtube URL updated successfully')
      setLoading(false)
    } catch (error) {
      console.error('Failed to update YouTube:', error)
      toast.error('Failed to update YouTube')
      setLoading(false)
    }
  }

  if(loading) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>
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
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </form>
  )
}
