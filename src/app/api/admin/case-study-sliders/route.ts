import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { CaseStudySliderMapper } from '@/infrastructure/mappers/case-study-slider.mapper'
import { caseStudySliderService } from '@/lib/services/case-study-slider.service'
import logger from '@/lib/logger'


export async function POST(request: NextRequest) {
  const { data } = await request.json()
  console.log('data in router ', data)

  try {
    console.log('Processing case study slider creation:', {
      mappedData: CaseStudySliderMapper.toPersistence(data)
    })

    const id = crypto.randomUUID()
    data.id = id;
    const newCaseStudySlider = await caseStudySliderService.createCaseStudySlider(data)


    console.log('newCaseStudySlider in router ', newCaseStudySlider)
    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDY_SLIDERS)

    return NextResponse.json(CaseStudySliderMapper.toPersistence(newCaseStudySlider))
  } catch (error) {
    logger.log('Error creating case study slider:', error)
    return NextResponse.json(
      { error: 'Failed to create case study slider', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// export async function GET() {
//   try {
//     console.log('Processing case study slider retrieval:')

//     const caseStudySliders = await caseStudySliderService.getCaseStudySliders();
//     console.log('caseStudySliders', caseStudySliders)

//     return NextResponse.json(caseStudySliders);
//   } catch (error) {
//     logger.log('Error retrieving case study sliders:', error)
//     return NextResponse.json(
//       { error: 'Failed to retrieve case study sliders', details: error instanceof Error ? error.message : 'Unknown error' },
//       { status: 500 }
//     )
//   }
// }
