
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { advisorService } from '@/lib/services/advisor.service'

import logger from '@/lib/logger'
export const dynamic = 'force-dynamic'
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { locale } = await request.json()

    console.log('Processing advisor deletion:', { id, locale })

    const success = await advisorService.deleteAdvisor(id, locale)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete advisor', details: 'Advisor not found' },
        { status: 404 }
      )
    }

    revalidateTag(CACHE_TAGS.ADVISORS)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.log('Error deleting advisor:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete advisor',
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
    const { id } = params
    const { data, locale } = await request.json()

    
    console.log('Processing advisor update:', {
      id,
      locale,
      mappedData: (data)
    })

    const updatedAdvisor = await advisorService.updateAdvisor(id, data, locale)

    if (!updatedAdvisor) {
      return NextResponse.json(
        { error: 'Advisor not found', details: 'No advisor exists with the provided ID' },
        { status: 404 }
      )
    }
    revalidateTag(CACHE_TAGS.ADVISORS)

    return NextResponse.json(updatedAdvisor)
  } catch (error) {
    logger.log('Error updating advisor:', error)
    return NextResponse.json(
      { error: 'Failed to update advisor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}