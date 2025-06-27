import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';
import { caseStudyService } from '@/lib/services/case-study.service';
export const dynamic = 'force-dynamic'
export async function PUT(request: NextRequest) {
  try {
    const { orders, locale } = await request.json();
    // orders should be an array of { id: string, order: number }
   
    await caseStudyService.updateCaseStudyOrder(orders, locale)

    // Optionally, force a cache revalidation
    console.log('submiting the order', orders, locale)
    revalidateTag(CACHE_TAGS.CASE_STUDIES);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating case study order:', error);
    return NextResponse.json(
      {
        error: 'Failed to update case study order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}