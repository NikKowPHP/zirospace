import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import logger from '@/lib/logger'
import { HeroModel } from '@/domain/models/models'

export interface IHeroRepository {
  getHero(locale: string): Promise<HeroModel | null>
  updateHero(heroData: Partial<HeroModel>, locale: string): Promise<HeroModel | null>
}
export class HeroRepository implements IHeroRepository {
  private supabaseClient: SupabaseClient
  private tableName: string = 'zirospace_hero'

  constructor() {
    this.supabaseClient = supabase
  }

  /**
   * Retrieves the single Hero entry.
   */
  async getHero(locale: string): Promise<HeroModel | null> {
    const table = this.tableName + '_' + locale
    const { data, error } = await this.supabaseClient
      .from(table)
      .select('*')
      .maybeSingle()
    logger.log('hero data from repository', data)

    if (error) {
      logger.log('Error fetching Hero entry:', error)
      return null
    }

    return data
  }

  /**
   * Updates the Hero entry.
   * @param heroData - The new Hero data.
   */
  async updateHero(heroData: Partial<HeroModel>, locale: string): Promise<HeroModel | null> {
    const existing = await this.getHero(locale)
    if (!existing) {
      logger.log("No existing Hero entry found to update")
      return null
    }
    const table = this.tableName + '_' + locale

    const { data, error } = await this.supabaseClient
      .from(table)
      .update(heroData)
      .eq('id', existing.id)
      .select()
      .single()

    logger.log('heroData in repository', heroData)

    if (error) {
      logger.log('Error updating Hero entry:', error)
      return null
    }

    return data
  }
}

// Export a singleton instance of the repository
export const heroRepository = new HeroRepository()