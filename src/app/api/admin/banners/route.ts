import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import logger from '@/lib/logger'
import { BannerMapper } from '@/infrastructure/mappers/banner.mapper'
import { bannerService } from '@/lib/services/banner.service'

export async function POST(request: NextRequest) {
  const { data, locale } = await request.json()

  try {
    console.log('Processing banner creation:', {
      locale,
      mappedData: BannerMapper.toPersistence(data)
    })

    // Generate ID
    const id = crypto.randomUUID()
    data.id = id

    const newBanner = await bannerService.createBanner(
      data,
      locale
    )

    // Revalidate cache
    revalidateTag(CACHE_TAGS.BANNERS)

    return NextResponse.json(newBanner)
  } catch (error) {
    logger.log('Error creating banner:', error)
    return NextResponse.json(
      { error: 'Failed to create banner', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
