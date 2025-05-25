import { HeroModel } from '@/domain/models/models'
import {
  heroRepository, IHeroRepository
 } from '@/lib/repositories/hero.repository'
import { heroRepositoryLocal } from '@/lib/repositories/hero.local.repository'
import  logger  from '@/lib/logger'

export class HeroService {
  private heroRepository: IHeroRepository
  constructor() {
    if(process.env.MOCK_REPOSITORIES === 'true' || process.env.NEXT_PUBLIC_MOCK_REPOSITORIES === 'true') {
      logger.log('Using Local Hero Repository (SQLite)');
      this.heroRepository = heroRepositoryLocal;
    } else {
      logger.log('Using Supabase Hero Repository');
      this.heroRepository = heroRepository;
    }
  }

  getHeroSection = async (locale: string): Promise<HeroModel | null> => {
    const heroSection = await this.heroRepository.getHero(locale)
    logger.log('heroSection', heroSection)
    return heroSection
  }

  updateHeroSection = async (
    heroData: Partial<HeroModel>,
    locale: string
  ): Promise<HeroModel | null> => {
    return this.heroRepository.updateHero( heroData, locale)
  }
}

// export singleton
export const heroService = new HeroService()
