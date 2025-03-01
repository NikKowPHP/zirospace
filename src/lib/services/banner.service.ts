import { Banner } from "@/domain/models/banner.model"
import { IBannerRepository } from "@/lib/interfaces/bannersRepository.interface"
import { bannerRepository} from "@/lib/repositories/banner.repository"
import { bannerRepositoryLocal } from "@/lib/repositories/banner.local.repository"
import { BannerMapper } from "@/infrastructure/mappers/banner.mapper"

export class BannerService {
  private bannerRepository: IBannerRepository
  constructor() {
    if(process.env.MOCK_REPOSITORIES === 'true') {
      this.bannerRepository = bannerRepositoryLocal
    } else {
      this.bannerRepository = bannerRepository
    }
  }

  getBanners = async (locale: string): Promise<Banner[]> => {
    const banners = await this.bannerRepository.getBanners(locale)
    return banners.map(banner => {
      if (banner.youtubeUrl) {
        banner.youtubeUrl = this.createYoutubeUrl(banner.youtubeUrl)
      }
      return banner
    })
  }

  getBannerById = async (id: string, locale: string): Promise<Banner | null> => {
    const banner = await this.bannerRepository.getBannerById(id, locale)
    if (banner?.youtubeUrl) {
      banner.youtubeUrl = this.createYoutubeUrl(banner.youtubeUrl)
    }
    return banner
  }

  createBanner = async (banner: Partial<Banner>, locale: string): Promise<Banner> => {
    const youtubeUrl = banner.youtubeUrl ? this.getYoutubeVideoId(banner.youtubeUrl) : undefined
    const bannerDto = BannerMapper.toPersistence({ ...banner, youtubeUrl })
    console.log('creating banner to dto in service', bannerDto)
    return this.bannerRepository.createBanner(bannerDto, locale)
  }

  updateBanner = async (id: string, banner: Partial<Banner>, locale: string): Promise<Banner | null> => {
    const youtubeUrl = banner.youtubeUrl ? this.getYoutubeVideoId(banner.youtubeUrl) : undefined
    const bannerDto = BannerMapper.toPersistence({ ...banner, youtubeUrl })
    console.log('updating banner to dto in service', bannerDto)
    return this.bannerRepository.updateBanner(id, bannerDto, locale)
  }

  deleteBanner = async (id: string, locale: string): Promise<void> => {
    return this.bannerRepository.deleteBanner(id, locale)

  }

  getActiveBanner = async (locale: string): Promise<Banner | null> => {
    return this.bannerRepository.getActiveBanner(locale)
  }

  private getYoutubeVideoId = (youtubeUrl: string): string => {
    // https://www.youtube.com/watch?v=Fz_Luw1V1ho
    const url = new URL(youtubeUrl)
    const videoId = url.searchParams.get('v')
    if (!videoId) {
      throw new Error('Invalid YouTube URL')
    }
    return videoId
  }

  private createYoutubeUrl = (videoId: string): string => {
    return `https://www.youtube.com/watch?v=${videoId}`
  }
}

// export singleton
export const bannerService = new BannerService()
