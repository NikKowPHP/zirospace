import { unstable_cache } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache'
import { supabase } from '../supabase'
import { CaseStudySliderDTO } from '@/infrastructure/dto/case-study-slider.dto'
import { CaseStudySliderMapper } from '@/infrastructure/mappers/case-study-slider.mapper'
import { CaseStudySlider } from '@/domain/models/case-study-slider.model'

export class CaseStudySliderRepository {
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
    [CACHE_TAGS.CASE_STUDIES],
    {
      revalidate: CACHE_TIMES.HOUR,
      tags: [CACHE_TAGS.CASE_STUDIES],
    }
  )

  
}

// export singleton
export const caseStudySliderRepository = new CaseStudySliderRepository();