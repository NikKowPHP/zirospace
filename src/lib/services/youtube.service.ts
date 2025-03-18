import { YoutubeModel } from "@/domain/models/models"
import { youtubeRepository } from "../repositories/youtube.repository"
import { youtubeRepositoryLocal } from "../repositories/youtube.repository.local"
export class YoutubeSectionService {
  private youtubeSectionRepository: IYoutubeSectionRepository
  constructor() {
    if(process.env.NEXT_PUBLIC_MOCK_REPOSITORIES === 'true') {
      this.youtubeSectionRepository = youtubeSectionRepositoryLocal 
    } else {
      this.youtubeSectionRepository = youtubeSectionRepository 
    }
  }
 
  getYoutubeSection = async ( ): Promise<YoutubeModel | null> => {
    const youtubeSection = await this.youtubeSectionRepository.getYoutubeSection()
    console.log('youtubeSection fetched in service', youtubeSection)
     return youtubeSection
  }
 

  updateYoutubeSection = async (youtubeSection: Partial<YoutubeModel>): Promise<YoutubeModel> => {
    return this.youtubeSectionRepository.updateYoutubeSection(youtubeSection)
  }
 
}

// export singleton
export const youtubeSectionService = new YoutubeSectionService()

export const getYoutubeSectionService = async () => {
  return new YoutubeSectionService()
}