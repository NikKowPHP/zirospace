import { NextRequest, NextResponse } from 'next/server'
import { UpdateService } from '@/lib/services/update.service'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import logger from '@/lib/logger'
import { Locale } from '@/i18n'
export const dynamic = 'force-dynamic'
const updateService = new UpdateService()

type Params = { id: string; locale: string }

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') as Locale

  if (!locale) {
    return NextResponse.json({ error: 'Locale is required' }, { status: 400 })
  }

  try {
    const update = await updateService.getUpdateById(id, locale)
    if (!update) {
      return NextResponse.json({ error: 'Update not found' }, { status: 404 })
    }
    return NextResponse.json(update)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') as Locale

  if (!locale) {
    return NextResponse.json({ error: 'Locale is required' }, { status: 400 })
  }

  try {
    const json = await request.json()

    const updatedUpdate = await updateService.updateUpdate(id, json, locale)
    revalidateTag(CACHE_TAGS.UPDATES)
    return NextResponse.json(updatedUpdate)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') as Locale

  logger.log(`DELETE request received for ID: ${id}, Locale: ${locale}`)

  if (!locale) {
    return NextResponse.json({ error: 'Locale is required' }, { status: 400 })
  }

  try {
    await updateService.deleteUpdate(id, locale)
    revalidateTag(CACHE_TAGS.UPDATES)

    return NextResponse.json(
      { message: 'Update deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error(`Error in DELETE /api/admin/updates/${id}:`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
