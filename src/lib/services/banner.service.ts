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
    return this.bannerRepository.getBanners(locale)
  }

  getBannerById = async (id: string, locale: string): Promise<Banner | null> => {
    return this.bannerRepository.getBannerById(id, locale)
  }

  createBanner = async (banner: Partial<Banner>, locale: string): Promise<Banner> => {
    const bannerDto = BannerMapper.toPersistence(banner)
    console.log('creating banner to dto in service', bannerDto)
    return this.bannerRepository.createBanner(bannerDto, locale)
  }

  updateBanner = async (id: string, banner: Partial<Banner>, locale: string): Promise<Banner | null> => {
    const bannerDto = BannerMapper.toPersistence(banner)
    console.log('updating banner to dto in service', bannerDto)
    return this.bannerRepository.updateBanner(id, bannerDto, locale)
  }

  deleteBanner = async (id: string, locale: string): Promise<void> => {
    return this.bannerRepository.deleteBanner(id, locale)

  }

  getActiveBanner = async (locale: string): Promise<Banner | null> => {
    return this.bannerRepository.getActiveBanner(locale)
  }
}

// export singleton
export const bannerService = new BannerService()