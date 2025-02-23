import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { caseStudySliderService } from '@/lib/services/case-study-slider.service'
import { CaseStudySliderMapper } from '@/infrastructure/mappers/case-study-slider.mapper'
import logger from '@/lib/logger'

export async function DELETE(
  request: NextRequest,
) {
  try {
    const { id } = await request.json()
    console.log('deleting case study slider', id)

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    console.log('Processing case study slider deletion:', { id })

    await caseStudySliderService.deleteCaseStudySlider(id)

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDY_SLIDERS)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.log('Error deleting case study slider:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete case study slider',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 

export async function PUT(request: NextRequest) {
  try {
    const { data, id } = await request.json()
    console.log('updating case study slider', id, data)
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    data.id = id
    data.updatedAt = new Date()

    logger.log(`Updating case study slider: ${id} with data: ${JSON.stringify(data)}`)
    console.log('Processing case study slider update:', {
      id,
      mappedData: CaseStudySliderMapper.toPersistence(data)
    })

    const updatedCaseStudySlider = await caseStudySliderService.updateCaseStudySlider(
      id,
      data
    )

    if (!updatedCaseStudySlider) {
      return NextResponse.json(
        {
          error: 'Case study slider not found',
          details: 'No case study slider exists with the provided ID'
        },
        { status: 404 }
      )
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDY_SLIDERS)

    return NextResponse.json(updatedCaseStudySlider)
  } catch (error) {
    logger.log('Error updating case study slider:', error)
    return NextResponse.json(
      { error: 'Failed to update case study slider', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 