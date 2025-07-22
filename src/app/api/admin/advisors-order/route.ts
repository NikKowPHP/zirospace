
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';
import { advisorService } from '@/lib/services/advisor.service';
export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const { orders, locale } = await request.json();
   
    await advisorService.updateAdvisorOrder(orders, locale)

    revalidateTag(CACHE_TAGS.ADVISORS);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating advisor order:', error);
    return NextResponse.json(
      {
        error: 'Failed to update advisor order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}