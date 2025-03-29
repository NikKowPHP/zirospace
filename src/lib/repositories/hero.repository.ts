// src/lib/repositories/hero.repository.ts

import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase' // Ensure this path is correct
import { supabase } from '../supabase' // Ensure this path is correct
import { HeroModel } from '@/domain/models/models' // Import the HeroModel
import { logger } from '@/lib/logger' // Import logger if needed for error logging

// Define the interface for the Hero Repository
export interface IHeroRepository {
  getHeroSection(locale: string): Promise<HeroModel[]>
  updateHeroSection(
    id: string,
    heroData: Partial<HeroModel>,
    locale: string
  ): Promise<HeroModel | null>
}

export class HeroRepository implements IHeroRepository {
  private supabaseClient: SupabaseClient<Database>
  private baseTableName: string

  constructor() {
    this.supabaseClient = supabase
    // Use the correct base table name for hero section
    this.baseTableName = `zirospace_hero`
  }

  /**
   * Gets the localized table name.
   * @param locale - The locale identifier (e.g., 'en', 'es').
   * @returns The full table name including the locale suffix.
   */
  private getTableName(locale: string): string {
    // Append locale, ensuring consistent naming convention (e.g., zirospace_hero_en)
    return `${this.baseTableName}_${locale}`
  }

  /**
   * Fetches all hero section entries for a given locale.
   * Corresponds to the getHeroSection method in HeroService.
   * @param locale - The locale for which to fetch hero sections.
   * @returns A promise that resolves to an array of HeroModel objects.
   */
  async getHeroSection(locale: string): Promise<HeroModel[]> {
    const tableName = this.getTableName(locale)
    logger.log(`Fetching hero sections from table: ${tableName}`) // Optional logging

    const { data, error } = await this.supabaseClient
      .from(tableName)
      .select('*') // Select all columns

    if (error) {
      logger.error(
        `Error fetching hero sections for locale ${locale} from ${tableName}`,
        error
      )
      // Depending on requirements, you might return [] or throw the error
      // Throwing makes the service layer responsible for handling it.
      throw new Error(`Failed to fetch hero sections for locale ${locale}`)
    }

    // Assuming the database schema directly matches the HeroModel structure.
    // If not, a mapper function would be needed here.
    // Supabase returns 'data' which should be HeroModel[] or null.
    return data || []
  }

  /**
   * Updates a specific hero section entry by its ID for a given locale.
   * Corresponds to the updateBanner (renamed to updateHeroSection) method in HeroService.
   * @param id - The unique identifier of the hero section to update.
   * @param heroData - An object containing the fields to update.
   * @param locale - The locale of the hero section to update.
   * @returns A promise that resolves to the updated HeroModel object, or null if not found or on error.
   */
  async updateHeroSection(
    id: string,
    heroData: Partial<HeroModel>,
    locale: string
  ): Promise<HeroModel | null> {
    const tableName = this.getTableName(locale)
    logger.log(`Updating hero section ID ${id} in table ${tableName}`, heroData) // Optional logging

    // Create a clean object for the update, ensuring undefined values don't cause issues
    // Supabase client generally handles undefined well, but explicit null conversion can be safer
    const updateData: { [key: string]: any } = {}
    for (const [key, value] of Object.entries(heroData)) {
      // Map model fields to potential DB fields if necessary
      // If keys match exactly, this loop might be simplified or removed
      updateData[key] = value === undefined ? null : value
    }
    // Ensure 'id' is not part of the update payload itself
    delete updateData.id

    const { data, error } = await this.supabaseClient
      .from(tableName)
      .update(updateData) // Pass the partial data object
      .eq('id', id) // Specify the row to update using its ID
      .select('*') // Select all columns of the updated row
      .single() // Expect exactly one row to be updated and returned

    if (error) {
      // Check specifically for "not found" errors if possible (depends on Supabase error codes)
      // e.g., PostgREST error code PGRST116 often means 0 rows found with .single()
      if (error.code === 'PGRST116') {
        logger.warn(
          `Hero section with ID ${id} not found for locale ${locale} during update.`
        )
        return null // Return null if the record wasn't found
      }
      logger.error(
        `Error updating hero section ${id} for locale ${locale} in ${tableName}`,
        error
      )
      // Return null as indicated by the HeroService's expected return type on failure
      return null
    }

    return data
  }
}

// Export a singleton instance of the repository
export const heroRepository = new HeroRepository()
