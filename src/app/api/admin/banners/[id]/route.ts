import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import logger from '@/lib/logger'
import { bannerService } from '@/lib/services/banner.service'
import { Locale } from '@/i18n'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const locale = (request.nextUrl.searchParams.get('locale') || 'en') as Locale // Default to 'en' if not provided

    console.log('Processing banner deletion:', { id, locale })

    await bannerService.deleteBanner(id, locale)

    // Revalidate cache
    revalidateTag(CACHE_TAGS.BANNERS)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.log('Error deleting banner:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete banner',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'GET method not implemented for banners/[id]' }, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { data, locale } = await request.json()
    
    console.log('Processing banner update in router:', {
      id,
      locale,
      data: data,
    })

    const updatedBanner = await bannerService.updateBanner(
      id,
      data,
      locale
    )

    console.log('updatedBanner in router after response ', updatedBanner)

    // Revalidate cache
    revalidateTag(CACHE_TAGS.BANNERS)

    return NextResponse.json(updatedBanner)
  } catch (error) {
    logger.log('Error updating banner:', error)
    return NextResponse.json(
      { error: 'Failed to update banner', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 