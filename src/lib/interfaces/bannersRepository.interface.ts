import { Banner } from "@/domain/models/banner.model"

export interface IBannerRepository {
  getBanners: (locale: string) => Promise<Banner[]>
  getBannerById: (id: string, locale: string) => Promise<Banner | null>
  createBanner: (banner: Partial<Banner>, locale: string) => Promise<Banner>
  updateBanner: (id: string, banner: Partial<Banner>, locale: string) => Promise<Banner>
  deleteBanner: (id: string, locale: string) => Promise<void>
  getActiveBanner: (locale: string) => Promise<Banner | null>
}