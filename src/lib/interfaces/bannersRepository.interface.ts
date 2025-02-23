import { Locale } from "@/i18n"
import { CaseStudy } from "@/domain/models/case-study.model"

export interface IBannerRepository {
  getBanners: (locale: Locale) => Promise<Banner[]>
  getBannerById: (id: string, locale: Locale) => Promise<Banner | null>
  createBanner: (banner: Partial<Banner>, locale: Locale) => Promise<Banner>
  updateBanner: (id: string, banner: Partial<Banner>, locale: Locale) => Promise<Banner>
  deleteBanner: (id: string, locale: Locale) => Promise<void>
}