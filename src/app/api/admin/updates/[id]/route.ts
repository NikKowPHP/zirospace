import { NextRequest, NextResponse } from 'next/server'
import { UpdateService } from '@/lib/services/update.service'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { z } from 'zod'
import logger from '@/lib/logger'

const updateSchema = z.object({
  title: z.string().min(3),
  publish_date: z.string(),
  content_html: z.string().optional(),
  excerpt: z.string().optional(),
  image_url: z.string().optional(),
  image_alt: z.string().optional(),
  is_published: z.boolean().default(false),
  order_index: z.number().default(0),
})

const updateService = new UpdateService()

type Params = { id: string; locale: string }

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale')

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
  const locale = searchParams.get('locale')

  if (!locale) {
    return NextResponse.json({ error: 'Locale is required' }, { status: 400 })
  }

  try {
    const json = await request.json()
    const result = updateSchema.safeParse(json)
    if (result.error) {
      console.error('Update validation failed:', result.error.errors)
      return NextResponse.json({ errors: result.error.errors }, { status: 400 })
    }

    const { publish_date: pubDate, ...updateData } = result.data
    const updatedUpdate = await updateService.updateUpdate(
      id,
      {
        ...updateData,
        publish_date: new Date(pubDate),
        content_html: updateData.content_html ?? null,
        excerpt: updateData.excerpt ?? null,
        image_url: updateData.image_url ?? null,
        image_alt: updateData.image_alt ?? null,
      },
      locale
    )
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
  const locale = searchParams.get('locale')

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
