import { Locale } from '@/i18n'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export interface Hero {
  id: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  imageUrl: string
  locale: Locale
}

export class HeroService {
  private getModel(locale: Locale) {
    return locale === 'pl' ? prisma.heroPL : prisma.heroEN
  }

  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getHero(locale: Locale): Promise<Hero | null> {
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
    hero: Partial<Hero>,
    locale: Locale
  ): Promise<Hero> {
    const model = this.getModel(locale)
    return (model as any).update({
      where: { id },
      data: hero as any,
    })
  }
}

export const heroService = new HeroService()
