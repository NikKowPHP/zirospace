import { YoutubeModel } from "@/domain/models/models"
import { youtubeRepository } from "../repositories/youtube.repository"

export interface IYoutubeRepository {
  getYoutube(): Promise<YoutubeModel | null>
  updateYoutube(youtube_url: string): Promise<YoutubeModel | null>
}

export class YoutubeService implements IYoutubeRepository {
  private youtubeRepository: IYoutubeRepository

  constructor() {
    this.youtubeRepository = youtubeRepository
  }

  getYoutube = async (): Promise<YoutubeModel | null> => {
    const youtubeData = await this.youtubeRepository.getYoutube()
    console.log('YouTube data fetched in service', youtubeData)
    return youtubeData
  }

  updateYoutube = async (youtube_url: string): Promise<YoutubeModel | null> => {
    return this.youtubeRepository.updateYoutube(youtube_url)
  }
}

// export singleton
export const youtubeService = new YoutubeService()

export const getYoutubeService = async () => {
  return new YoutubeService()
}