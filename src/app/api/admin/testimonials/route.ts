import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { testimonialService } from '@/lib/services/testimonials.service'
import logger from '@/lib/logger'
import { Locale } from '@/i18n'
export async function POST(request: NextRequest) {
  const { data, locale } = await request.json()
  
  try {
    const id = crypto.randomUUID()
    data.id = id;
    console.log('Processing testimonial creation:', {
      locale,
      mappedData: (data)
    })

    const newTestimonial = await testimonialService.createTestimonial(data, locale)

    // Revalidate cache
    revalidateTag(CACHE_TAGS.TESTIMONIALS)

    return NextResponse.json(newTestimonial)
  } catch (error) {
    logger.log('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') as Locale;

    console.log('Processing testimonial retrieval:', { locale })

    const testimonials = await testimonialService.getTestimonials(locale);

    return NextResponse.json(testimonials);
  } catch (error) {
    logger.log('Error retrieving testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve testimonials', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
