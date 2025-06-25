import { Locale } from '@/i18n'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { HeroModel } from '@/domain/models/models'



export class HeroService {
  private getModel(locale: Locale) {
    return locale === 'pl' ? prisma.zirospace_hero_pl : prisma.zirospace_hero_en
  }

  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getHero(locale: Locale): Promise<HeroModel | null> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findFirst()
      },
      `hero-${locale}`,
      [CACHE_TAGS.HERO, `hero:${locale}`]
    )
    return cachedFn(locale)
  }

  async updateHero(
    id: string,
    hero: Partial<HeroModel>,
    locale: Locale
  ): Promise<HeroModel> {
    const model = this.getModel(locale)
    return (model as any).update({
      where: { id },
      data: hero as any,
    })
  }
}

export const heroService = new HeroService()
