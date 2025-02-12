import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { caseStudyService } from '@/lib/services/case-study.service'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import logger from '@/lib/logger'
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params
    const { locale } = await request.json()

    console.log('Processing case study deletion:', { id, locale })

    await caseStudyService.deleteCaseStudy(id, locale)

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDIES)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.log('Error deleting case study:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete case study',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, locale } = await request.json()
    
    console.log('Processing case study update:', {
      id,
      locale,
      mappedToPersistance:CaseStudyMapper.toPersistence(data),
    })

    const updatedCaseStudy = await caseStudyService.updateCaseStudy(
      id,
      data,
      locale
    )

    console.log('updatedCaseStudy in router after response ', updatedCaseStudy)

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDIES)

    return NextResponse.json(updatedCaseStudy)
  } catch (error) {
    logger.log('Error updating case study:', error)
    return NextResponse.json(
      { error: 'Failed to update case study', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 