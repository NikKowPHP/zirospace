import { CACHE_TAGS } from '@/lib/utils/cache';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // const tag = request.nextUrl.searchParams.get('tag');

    for (const tag of Object.values(CACHE_TAGS)) {
       revalidateTag(tag)
    }
 
    return NextResponse.json({ revalidated: true, now: Date.now() });
  


}
