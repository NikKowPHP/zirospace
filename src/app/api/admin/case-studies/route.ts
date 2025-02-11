import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import { caseStudyService } from '@/lib/services/case-study.service'

export async function POST(request: NextRequest) {
  const { data, locale } = await request.json()
  
  try {
    console.log('Processing case study creation:', {
      locale,
      mappedData: CaseStudyMapper.toPersistence(data)
    })

    const newCaseStudy = await caseStudyService.createCaseStudy(
      CaseStudyMapper.toPersistence(data),
      locale
    )

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDIES)

    return NextResponse.json(CaseStudyMapper.toDomain(newCaseStudy))
  } catch (error) {
    console.error('Error creating case study:', error)
    return NextResponse.json(
      { error: 'Failed to create case study', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
