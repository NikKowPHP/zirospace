import { CACHE_TAGS } from '@/lib/utils/cache';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'
export async function POST() {
  // const tag = request.nextUrl.searchParams.get('tag');

    for (const tag of Object.values(CACHE_TAGS)) {
       revalidateTag(tag)
    }
 
    return NextResponse.json({ revalidated: true, now: Date.now() });
  


}
