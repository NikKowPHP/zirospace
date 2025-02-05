import { unstable_cache } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'
import { Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/case-study.model'
import { CaseStudyDTO } from '@/infrastructure/dto/case-study.dto'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache'
import { supabase } from '../supabase'

export class CaseStudyRepository {
  private supabaseClient: SupabaseClient

  constructor() {
      this.supabaseClient = supabase
  }

  getCaseStudies = unstable_cache(
    async (locale: Locale): Promise<CaseStudy[]> => {
      const { data, error } = await this.supabaseClient
        .from(`case_studies_${locale}`)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching case studies:', error)
        return []
      }

      return (data as CaseStudyDTO[]).map(CaseStudyMapper.toDomain)
    },
    [CACHE_TAGS.CASE_STUDIES],
    {
      revalidate: CACHE_TIMES.HOUR,
      tags: [CACHE_TAGS.CASE_STUDIES],
    }
  )

  getCaseStudyBySlug = async (slug: string, locale: Locale): Promise<CaseStudy | null> => {
    return unstable_cache(
      async () => {
        const { data, error } = await this.supabaseClient
          .from(`case_studies_${locale}`)
          .select('*')
          .eq('slug', slug)
          .single()

        if (error) {
          console.error('Error fetching case study:', error)
          return null
        }

        return data ? CaseStudyMapper.toDomain(data as CaseStudyDTO) : null
      },
      [`case-study-${slug}-${locale}`],
      {
        revalidate: CACHE_TIMES.DAY,
        tags: [CACHE_TAGS.CASE_STUDIES],
      }
    )()
  }
}

// export singleton
export const caseStudyRepository = new CaseStudyRepository();