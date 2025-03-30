import { HeroModel } from '@/domain/models/models'
import { heroRepository } from '@/lib/repositories/hero.repository'
import { logger } from '@/lib/logger'

export class HeroService {
  private heroRepository: IHeroRepository
  constructor() {
    // if(process.env.MOCK_REPOSITORIES === 'true') {
    //   this.bannerRepository = bannerRepositoryLocal
    // } else {
    this.heroRepository = heroRepository
    // }
  }

  getHeroSection = async (locale: string): Promise<HeroModel[]> => {
    const heroSection = await this.heroRepository.getHeroSection(locale)
    logger.log('heroSection', heroSection)
    return heroSection
  }

  updateBanner = async (
    id: string,
    heroData: Partial<HeroModel>,
    locale: string
  ): Promise<HeroModel | null> => {
    return this.heroRepository.updateHeroSection(id, heroData, locale)
  }
}

// export singleton
export const heroService = new HeroService()
