import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { CaseStudySliderMapper } from '@/infrastructure/mappers/case-study-slider.mapper'
import { caseStudySliderService } from '@/lib/services/case-study-slider.service'

export async function POST(request: NextRequest) {
  const { data } = await request.json()
  
  try {
    console.log('Processing case study slider creation:', {
      mappedData: CaseStudySliderMapper.toPersistence(data)
    })

    const newCaseStudySlider = await caseStudySliderService.createCaseStudySlider(CaseStudySliderMapper.toDomain(data))

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDIES)

    return NextResponse.json(CaseStudySliderMapper.toPersistence(newCaseStudySlider))
  } catch (error) {
    console.error('Error creating case study slider:', error)
    return NextResponse.json(
      { error: 'Failed to create case study slider', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('Processing case study slider retrieval:')

    const caseStudySliders = await caseStudySliderService.getCaseStudySliders();

    return NextResponse.json(caseStudySliders.map(CaseStudySliderMapper.toPersistence));
  } catch (error) {
    console.error('Error retrieving case study sliders:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve case study sliders', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
