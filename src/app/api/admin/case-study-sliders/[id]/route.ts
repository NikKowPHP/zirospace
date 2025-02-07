import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { caseStudySliderService } from '@/lib/services/case-study-slider.service'
import { CaseStudySliderMapper } from '@/infrastructure/mappers/case-study-slider.mapper'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { locale } = await request.json()

    console.log('Processing case study slider deletion:', { id, locale })

    await caseStudySliderService.deleteCaseStudySlider(id)

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDIES)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting case study slider:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete case study slider',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const { data } = await request.json()
    
    console.log('Processing case study slider update:', {
      id,
      mappedData: CaseStudySliderMapper.toPersistence(data)
    })

    const updatedCaseStudySlider = await caseStudySliderService.updateCaseStudySlider(id, CaseStudySliderMapper.toDomain(data))

    if (!updatedCaseStudySlider) {
      return NextResponse.json(
        { error: 'Case study slider not found', details: 'No case study slider exists with the provided ID' },
        { status: 404 }
      )
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDIES)

    return NextResponse.json(CaseStudySliderMapper.toPersistence(updatedCaseStudySlider))
  } catch (error) {
    console.error('Error updating case study slider:', error)
    return NextResponse.json(
      { error: 'Failed to update case study slider', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 