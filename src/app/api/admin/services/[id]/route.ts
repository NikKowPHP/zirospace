import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { serviceService } from '@/lib/services/service.service'
import logger from '@/lib/logger'
import { z } from 'zod'
import { Locale } from '@/i18n'

// Define Zod schema for PUT request body
const putServiceSchema = z.object({
  data: z.object({
    title: z
      .string()
      .min(3, { message: 'Title must be at least 3 characters' })
      .optional(),
    slug: z.string().optional(),
    subtitle: z.string().nullable().optional(),
    content_html: z.string().optional(),
    excerpt: z.string().nullable().optional(),
    image_url: z.string().nullable().optional(),
    image_alt: z.string().nullable().optional(),
    is_published: z
      .preprocess((val) => {
        if (typeof val === 'string') {
          return val === 'true'
        }
        if (typeof val === 'number') {
          return val === 1
        }
        return val
      }, z.boolean().default(false))
      .optional(),
    meta_title: z.string().nullable().optional(),
    meta_description: z.string().nullable().optional(),
    keywords: z.array(z.string()).optional(),
    order_index: z.number().optional(),
  }),
})

// Define Zod schema for GET/DELETE request params
const serviceIdLocaleSchema = z.object({
  id: z.string(),
  locale: z.string(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('locale') as Locale
    if (!locale) {
      logger.error('Locale is required for get request')
      return NextResponse.json({ error: 'Locale is required' }, { status: 400 })
    }

    const validatedParams = serviceIdLocaleSchema.safeParse({ id, locale })

    if (!validatedParams.success) {
      logger.error(
        'Validation error fetching service by ID:',
        validatedParams.error.issues
      )
      return NextResponse.json(
        { error: 'Validation error', details: validatedParams.error.issues },
        { status: 400 }
      )
    }

    const { id: validatedId, locale: validatedLocale } = validatedParams.data

    console.log('processing service get request by ID', {
      id: validatedId,
      locale: validatedLocale,
    })
    logger.log(`Fetching service by ID: ${validatedId} ${validatedLocale}`)
    const service = await serviceService.getServiceById(
      validatedId,
      validatedLocale as Locale
    )
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    return NextResponse.json(service)
  } catch (error: unknown) {
    logger.error(`Error fetching service: ${error}`)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params
    const searchParams = request.nextUrl.searchParams
    const body = await request.json()
    logger.log('validated body and body', body)
    const validatedBody = putServiceSchema.parse({ data: body })

    const { data: domainData } = validatedBody

    const locale = searchParams.get('locale') as Locale

    if (!id || !locale) {
      return NextResponse.json(
        { error: 'Missing id or locale' },
        { status: 400 }
      )
    }

    logger.log(`PUT request received with id=${id}, locale=${locale}`)
    logger.log(`data after validation ${JSON.stringify(domainData)}`)

    const updatedService = await serviceService.updateService(
      id,
      domainData,
      locale as Locale
    )
    logger.log(`updatedService ${JSON.stringify(updatedService)} `)

    if (!updatedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.SERVICES)
    return NextResponse.json(updatedService)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      logger.error('Validation error updating service:', error.issues)
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    logger.error(`Error updating service: ${error} `)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('locale') as Locale

    const validatedParams = serviceIdLocaleSchema.safeParse({ id, locale })

    if (!validatedParams.success) {
      logger.error(
        'Validation error deleting service:',
        validatedParams.error.issues
      )
      return NextResponse.json(
        { error: 'Validation error', details: validatedParams.error.issues },
        { status: 400 }
      )
    }

    const { id: validatedId, locale: validatedLocale } = validatedParams.data

    logger.log(
      `Deleting service: ${validatedId} for locale: ${validatedLocale} `
    )
    const deletedService = await serviceService.deleteService(
      validatedId,
      validatedLocale as Locale
    )
    if (!deletedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.SERVICES)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    logger.error(`Error deleting service: ${error} `)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
