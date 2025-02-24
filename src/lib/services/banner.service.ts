import { Banner } from "@/domain/models/banner.model"
import { IBannerRepository } from "@/lib/interfaces/bannersRepository.interface"
import { bannerRepository} from "@/lib/repositories/banner.repository"
import { bannerRepositoryLocal } from "@/lib/repositories/banner.local.repository"

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
    return this.bannerRepository.getBanners(locale)
  }

  getBannerById = async (id: string, locale: string): Promise<Banner | null> => {
    return this.bannerRepository.getBannerById(id, locale)
  }

  createBanner = async (banner: Banner, locale: string): Promise<Banner> => {
    return this.bannerRepository.createBanner(banner, locale)
  }

  updateBanner = async (id: string, banner: Banner, locale: string): Promise<Banner | null> => {
    return this.bannerRepository.updateBanner(id, banner, locale)
  }

  deleteBanner = async (id: string, locale: string): Promise<void> => {
    return this.bannerRepository.deleteBanner(id, locale)
  }
}

// export singleton
export const bannerService = new BannerService()