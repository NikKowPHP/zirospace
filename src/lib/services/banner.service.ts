import { Locale } from '@/i18n'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export interface Banner {
  id: string
  title: string
  content: string
  imageUrl: string
  link?: string
  isActive: boolean
  orderIndex: number
  locale: Locale
}

export class BannerService {
  private getModel(locale: Locale) {
    return locale === 'pl' ? prisma.bannerPL : prisma.bannerEN
  }

  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getBanners(locale: Locale): Promise<Banner[]> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findMany({
          orderBy: { orderIndex: 'asc' },
          where: { isActive: true }
        })
      },
      `banners-${locale}`,
      [CACHE_TAGS.BANNERS, `banners:${locale}`]
    )
    return cachedFn(locale)
  }

  async getActiveBanner(locale: Locale): Promise<Banner | null> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findFirst({
          where: { isActive: true },
          orderBy: { orderIndex: 'asc' },
        })
      },
      `active-banner-${locale}`,
      [CACHE_TAGS.BANNERS, `active-banner:${locale}`]
    )
    return cachedFn(locale)
  }

  async createBanner(
    banner: Partial<Banner>,
    locale: Locale
  ): Promise<Banner> {
    const model = this.getModel(locale)
    return (model as any).create({
      data: banner as any,
    })
  }

  async updateBanner(
    id: string,
    banner: Partial<Banner>,
    locale: Locale
  ): Promise<Banner> {
    const model = this.getModel(locale)
    return (model as any).update({
      where: { id },
      data: banner as any,
    })
  }

  async deleteBanner(id: string, locale: Locale): Promise<void> {
    const model = this.getModel(locale)
    await (model as any).delete({
      where: { id },
    })
  }
}

export const bannerService = new BannerService()
