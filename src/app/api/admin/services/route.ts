import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';
import { serviceService } from '@/lib/services/service.service';
import { ServiceMapper } from '@/infrastructure/mappers/service.mapper';
import logger from '@/lib/logger';
import { z } from 'zod';

// Define Zod schema for POST request body
const postServiceSchema = z.object({
  data: z.object({
    id: z.string().optional(),
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    slug: z.string().optional(),
    subtitle: z.string().optional(),
    content_html: z.string().optional(),
    excerpt: z.string().optional(),
    image_url: z.string().optional(),
    image_alt: z.string().optional(),
    is_published: z.boolean().default(false),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    order_index: z.number().optional(),
  }),
  locale: z.string(),
});

// Define Zod schema for PUT request body
// put can be undefined 
const putServiceSchema = z.object({
  data: z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }).optional(),
    slug: z.string().optional(),
    subtitle: z.string().optional(),
    content_html: z.string().optional(),
    excerpt: z.string().optional(),
    image_url: z.string().optional(),
    image_alt: z.string().optional(),
    is_published: z.boolean().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    order_index: z.number().optional(),
  }),
locale: z.string().optional(),
});

// Define Zod schema for GET/PUT/DELETE request params
const serviceIdLocaleSchema = z.object({
  id: z.string().uuid(),
  locale: z.string(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedBody = postServiceSchema.parse(body);
    logger.log('body', body)

    const { data, locale } = validatedBody;
    console.log('Processing service creation', data);

    console.log('Processing service creation:', {
      locale,
      mappedData: ServiceMapper.toPersistence(data),
    });
    const id = crypto.randomUUID();
    data.id = id;

    const newService = await serviceService.createService(data, locale);

    revalidateTag(CACHE_TAGS.SERVICES);

    return NextResponse.json(newService);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      logger.error('Validation error creating service:', error.issues);
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    logger.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const locale = searchParams.get('locale');

    const validatedParams = serviceIdLocaleSchema.safeParse({ id, locale });

    if (!validatedParams.success) {
      logger.error('Validation error fetching service:', validatedParams.error.issues);
      return NextResponse.json({ error: 'Validation error', details: validatedParams.error.issues }, { status: 400 });
    }

    const { id: validatedId, locale: validatedLocale } = validatedParams.data;

    console.log('processing service get request', { id: validatedId, locale: validatedLocale });
    logger.log(`Fetching service: ${validatedId} ${validatedLocale}`);
    const service = await serviceService.getServiceById(validatedId, validatedLocale);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error: unknown) {
    logger.error(`Error fetching service: ${error}`);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') as string;
    const locale = searchParams.get('locale') as string;

    const validatedParams = serviceIdLocaleSchema.safeParse({ id, locale });

    if (!validatedParams.success) {
      logger.error('Validation error updating service:', validatedParams.error.issues);
      return NextResponse.json({ error: 'Validation error', details: validatedParams.error.issues }, { status: 400 });
    }

    const { id: validatedId, locale: validatedLocale } = validatedParams.data;

    const body = await request.json();
    // Log raw request body
    logger.log('PUT service: Raw request body', body);

    // Validate only the data part of the body, locale is validated from query params
    const validatedBody = putServiceSchema.parse( body );
    // Log validated request body
    logger.log('PUT service: Validated request body', validatedBody);

    const { data } = validatedBody;

    logger.log(`Updating service: ${validatedId} ${validatedLocale} with data: ${JSON.stringify(data)}`);
    // Use validatedLocale from query params
    const updatedService = await serviceService.updateService(validatedId, data, validatedLocale);

    if (!updatedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    revalidateTag(CACHE_TAGS.SERVICES);
    return NextResponse.json(updatedService);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      logger.error('Validation error updating service:', error.issues);
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    logger.error(`Error updating service: ${error}`);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') as string;
    const locale = searchParams.get('locale') as string;

    const validatedParams = serviceIdLocaleSchema.safeParse({ id, locale });

    if (!validatedParams.success) {
      logger.error('Validation error deleting service:', validatedParams.error.issues);
      return NextResponse.json({ error: 'Validation error', details: validatedParams.error.issues }, { status: 400 });
    }

    const { id: validatedId, locale: validatedLocale } = validatedParams.data;

    logger.log(`Deleting service: ${validatedId} for locale: ${validatedLocale}`);
    const deletedService = await serviceService.deleteService(validatedId, validatedLocale);
    if (!deletedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.SERVICES);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    logger.error(`Error deleting service: ${error}`);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
