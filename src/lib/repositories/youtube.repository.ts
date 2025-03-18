import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import logger from '@/lib/logger'
import { YoutubeModel } from '@/domain/models/models'
import { IYoutubeRepository } from '../services/youtube.service'



export class YoutubeRepository implements IYoutubeRepository{
  private supabaseClient: SupabaseClient
  private tableName: string = 'zirospace_youtube'

  constructor() {
    this.supabaseClient = supabase
  }

  /**
   * Retrieves the single YouTube entry.
   */
  async getYoutube(): Promise<YoutubeModel | null> {
    const { data, error } = await this.supabaseClient
      .from(this.tableName)
      .select('*')
      .maybeSingle()

    if (error) {
      logger.log('Error fetching YouTube entry:', error)
      return null
    }

    return data
  }

  /**
   * Updates the YouTube URL in the single YouTube entry.
   * @param youtube_url - The new YouTube URL.
   */
  async updateYoutube(youtube_url: string): Promise<YoutubeModel | null> {
    // Retrieve the existing record; assuming there's only one entry.
    const existing = await this.getYoutube()
    if (!existing) {
      logger.log("No existing YouTube entry found to update")
      return null
    }

    const { data, error } = await this.supabaseClient
      .from(this.tableName)
      .update({ youtube_url })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      logger.log('Error updating YouTube entry:', error)
      return null
    }

    return data
  }
}

// Export a singleton instance of the repository
export const youtubeRepository = new YoutubeRepository()