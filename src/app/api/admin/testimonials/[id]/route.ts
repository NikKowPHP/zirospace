import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { TestimonialMapper } from '@/infrastructure/mappers/testimonial.mapper'
import { testimonialService } from '@/lib/services/testimonials.service'

import logger from '@/lib/logger'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { locale } = await request.json()

    console.log('Processing testimonial deletion:', { id, locale })

    const success = await testimonialService.deleteTestimonial(id, locale)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete testimonial', details: 'Testimonial not found' },
        { status: 404 }
      )
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.TESTIMONIALS)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.log('Error deleting testimonial:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete testimonial',
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

    
    console.log('Processing testimonial update:', {
      id,
      locale,
      mappedData: TestimonialMapper.toPersistence(data)
    })

    const updatedTestimonial = await testimonialService.updateTestimonial(id, TestimonialMapper.toDomain(data), locale)

    if (!updatedTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found', details: 'No testimonial exists with the provided ID' },
        { status: 404 }
      )
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.TESTIMONIALS)

    return NextResponse.json(TestimonialMapper.toPersistence(updatedTestimonial))
  } catch (error) {
    logger.log('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 