
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';
import { testimonialService } from '@/lib/services/testimonials.service';
export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const { orders, locale } = await request.json();
    // orders should be an array of { id: string, order: number }
   
    await testimonialService.updateTestimonialOrder(orders, locale)

    // Optionally, force a cache revalidation
    console.log('submitting the order', orders, locale)
    revalidateTag(CACHE_TAGS.TESTIMONIALS);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating testimonial order:', error);
    return NextResponse.json(
      {
        error: 'Failed to update testimonial order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}