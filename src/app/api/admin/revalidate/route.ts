import {  NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import logger from '@/lib/logger'

export async function GET() {
  try {
   
    console.log('Revalidating cache')

    // Revalidate cache
    Object.values(CACHE_TAGS).forEach(tag => {
      console.log('Revalidating tag:', tag)
      revalidateTag(tag)
    })

    return NextResponse.json({ message: 'Cache revalidated' })
  } catch (error) {
    logger.log('Error revalidating cache:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate cache', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
