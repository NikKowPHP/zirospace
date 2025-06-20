import { HeroModel } from '@/domain/models/models'
import logger from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export class HeroService {
  getHeroSection = async (locale: string): Promise<HeroModel | null> => {
    const heroSection = await this.heroRepository.getHero(locale)
    logger.log('heroSection', heroSection)
    return heroSection
  }

  updateHeroSection = async (
    heroData: Partial<HeroModel>,
    locale: string
  ): Promise<HeroModel | null> => {
    return this.heroRepository.updateHero(heroData, locale)
  }
}

// export singleton
export const heroService = new HeroService()
