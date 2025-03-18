'use server'
import { youtubeService } from '@/lib/services/youtube.service'
import { YoutubeModel } from '@/domain/models/models'

export async function updateYoutubeAction(data: Partial<YoutubeModel>) {
  if (!data.youtube_url) {
    throw new Error('Youtube URL is required')
  }
  return await youtubeService.updateYoutube(data.youtube_url)
}

export async function getYoutubeAction() {
  return await youtubeService.getYoutube()
}