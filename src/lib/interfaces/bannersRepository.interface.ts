import { Banner } from "@/domain/models/banner.model"
import { BannerDTO } from "@/infrastructure/dto/banner.dto"

export interface IBannerRepository {
  getBanners: (locale: string) => Promise<Banner[]>
  getBannerById: (id: string, locale: string) => Promise<Banner | null>
  createBanner: (banner: Partial<BannerDTO>, locale: string) => Promise<Banner>
  updateBanner: (id: string, banner: Partial<BannerDTO>, locale: string) => Promise<Banner>
  deleteBanner: (id: string, locale: string) => Promise<void>
  getActiveBanner: (locale: string) => Promise<Banner | null>
}