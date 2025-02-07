import { unstable_cache } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache'
import { supabase } from '../supabase'
import { CaseStudySliderDTO } from '@/infrastructure/dto/case-study-slider.dto'
import { CaseStudySliderMapper } from '@/infrastructure/mappers/case-study-slider.mapper'
import { CaseStudySlider } from '@/domain/models/case-study-slider.model'
import { ICaseStudySliderRepository } from '../interfaces/caseStudySliderRepository.interface'

export class CaseStudySliderRepository implements ICaseStudySliderRepository {
  private supabaseClient: SupabaseClient

  constructor() {
      this.supabaseClient = supabase
  }

  getCaseStudiesSliders = unstable_cache(
    async (): Promise<CaseStudySlider[]> => {
      const { data, error } = await this.supabaseClient
        .from(`case_studies_sliders`)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching case studies:', error)
        return []
      }

      return (data as CaseStudySliderDTO[]).map(CaseStudySliderMapper.toDomain)
    },
    [CACHE_TAGS.CASE_STUDY_SLIDERS],
    {
      revalidate: CACHE_TIMES.HOUR,
      tags: [CACHE_TAGS.CASE_STUDY_SLIDERS],
    }
  )

  async createCaseStudySlider(caseStudySlider: CaseStudySlider): Promise<CaseStudySlider> {
    const { data, error } = await this.supabaseClient
      .from(`case_studies_sliders`)
      .insert([CaseStudySliderMapper.toPersistence(caseStudySlider)])
      .select()
      
    if (error) {
      console.error('Error creating case study slider:', error)
      throw new Error(`Failed to create case study slider: ${error.message}`)
    }

    return CaseStudySliderMapper.toDomain(data[0] as CaseStudySliderDTO)
  }

  async updateCaseStudySlider(id: string, caseStudySlider: Partial<CaseStudySlider>): Promise<CaseStudySlider | null> {
    const { data, error } = await this.supabaseClient
      .from(`case_studies_sliders`)
      .update(CaseStudySliderMapper.toPersistence(caseStudySlider))
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating case study slider:', error)
      return null
    }

    if (!data || data.length === 0) {
      return null
    }

    return CaseStudySliderMapper.toDomain(data[0] as CaseStudySliderDTO)
  }

  async deleteCaseStudySlider(id: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from(`case_studies_sliders`)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting case study slider:', error)
      throw new Error(`Failed to delete case study slider: ${error.message}`)
    }
  }
}

// export singleton
export const caseStudySliderRepository = new CaseStudySliderRepository();