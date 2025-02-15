import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import { caseStudyService } from '@/lib/services/case-study.service'
import logger from '@/lib/logger'
export async function POST(request: NextRequest) {
  const { data, locale } = await request.json()
  
  try {
    console.log('Processing case study creation:', {
      locale,
      mappedData: CaseStudyMapper.toPersistence(data)
    })
        // generate id 
        const id = crypto.randomUUID()
        data.id = id;

    
    const newCaseStudy = await caseStudyService.createCaseStudy(
      CaseStudyMapper.toPersistence(data),
      locale
    )

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDIES)

    return NextResponse.json(newCaseStudy)
  } catch (error) {
    logger.log('Error creating case study:', error)
    return NextResponse.json(
      { error: 'Failed to create case study', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
