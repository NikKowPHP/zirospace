'use server'
import { Suspense } from 'react'
import { YoutubeForm } from './components/youtube-form'
import { youtubeService } from '@/lib/services/youtube.service'

import { YoutubeModel } from '@/domain/models/models'
export default async function YoutubeAdminPage() {

  const youtubeSection = await youtubeService.getYoutube()

  const handleUpdate = async (youtubeSection: Partial<YoutubeModel>) => {
    if (!youtubeSection.youtube_url) {
      throw new Error('Youtube URL is required')
    }
    await youtubeService.updateYoutube(youtubeSection.youtube_url)
  }
  
 
  return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold mb-6">Youtube Sections Management</h2>
          <Suspense fallback={<div>Loading...</div>}>
          <YoutubeForm youtube={youtubeSection} />
          </Suspense>
        </div>
      </div>
  )
}
