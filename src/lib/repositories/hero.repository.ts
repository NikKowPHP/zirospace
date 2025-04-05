import { PrismaClient } from '@prisma/client'
import logger from '@/lib/logger'
import { HeroModel } from '@/domain/models/models'

export interface IHeroRepository {
  getHero(locale: string): Promise<HeroModel | null>
  updateHero(heroData: Partial<HeroModel>, locale: string): Promise<HeroModel | null>

}// Export a singleton instance with the default Prisma client

import prisma from '@/lib/prisma'

export class HeroRepository implements IHeroRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getHero(locale: string): Promise<HeroModel | null> {
    try {
      logger.log('locale on hero repository' , locale)
      const hero = await this.prisma.hero.findUnique({
        where: { locale }
      })
      logger.log('Hero data from repository:', hero)
      return hero
    } catch (error) {
      logger.log('Error fetching Hero entry:', error)
      return null
    }
  }

  async updateHero(heroData: Partial<HeroModel>, locale: string): Promise<HeroModel | null> {
    try {
      const existing = await this.getHero(locale)
      if (!existing) {
        logger.log("No existing Hero entry found to update")
        return null
      }

      const updatedHero = await this.prisma.hero.update({
        where: { locale },
        data: heroData
      })

      logger.log('Updated hero data:', updatedHero)
      return updatedHero
    } catch (error) {
      logger.log('Error updating Hero entry:', error)
      return null
    }
  }
}

export const heroRepository = new HeroRepository(prisma)