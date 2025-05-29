import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache'; // Ensured this import is present
import { CACHE_TAGS } from '@/lib/utils/cache'; // Ensured this import is present
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
    subtitle: z.string().nullable().optional(),
    content_html: z.string().optional(),
    excerpt: z.string().nullable().optional(),
    image_url: z.string().nullable().optional(),
    image_alt: z.string().nullable().optional(),
    is_published: z.boolean().default(false),
    meta_title: z.string().nullable().optional(),
    meta_description: z.string().nullable().optional(),
    keywords: z.array(z.string()).optional(),
    order_index: z.number().optional(),
  }),
  locale: z.string(),
});

// Define Zod schema for PUT request body
const putServiceSchema = z.object({
  data: z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }).optional(),
    slug: z.string().optional(),
    subtitle: z.string().nullable().optional(),
    contentHtml: z.string().optional(), // Matches Service model for clarity
    excerpt: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(), // Matches Service model for clarity
    imageAlt: z.string().nullable().optional(), // Matches Service model for clarity
    isPublished: z.boolean().optional(),
    metaTitle: z.string().nullable().optional(),
    metaDescription: z.string().nullable().optional(),
    keywords: z.array(z.string()).optional(),
    orderIndex: z.number().optional(),
  }),
  // locale is expected as a query parameter for PUT
});

// Define Zod schema for GET/PUT/DELETE request params
const serviceIdLocaleSchema = z.object({
  id: z.string().uuid(), // Assuming UUIDs, adjust if different and if your IDs are not UUIDs
  locale: z.string(),
});

const serviceLocaleSchema = z.object({
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

    revalidateTag(CACHE_TAGS.SERVICES); // Ensured revalidateTag is called

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

    if (id) {
      const validatedParams = serviceIdLocaleSchema.safeParse({ id, locale });

      if (!validatedParams.success) {
        logger.error('Validation error fetching service by ID:', validatedParams.error.issues);
        return NextResponse.json({ error: 'Validation error', details: validatedParams.error.issues }, { status: 400 });
      }

      const { id: validatedId, locale: validatedLocale } = validatedParams.data;

      console.log('processing service get request by ID', { id: validatedId, locale: validatedLocale });
      logger.log(`Fetching service by ID: ${validatedId} ${validatedLocale}`);
      const service = await serviceService.getServiceById(validatedId, validatedLocale);
      if (!service) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json(service);
    } else {
      const validatedParams = serviceLocaleSchema.safeParse({ locale });

      if (!validatedParams.success) {
        logger.error('Validation error fetching all services:', validatedParams.error.issues);
        return NextResponse.json({ error: 'Validation error', details: validatedParams.error.issues }, { status: 400 });
      }

      const { locale: validatedLocale } = validatedParams.data;

      console.log('processing service get request for all services', { locale: validatedLocale });
      logger.log(`Fetching all services for locale: ${validatedLocale}`);
      const services = await serviceService.getServices(validatedLocale);
      return NextResponse.json(services);
    }
  } catch (error: unknown) {
    logger.error(`Error fetching service: ${error}`);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const locale = searchParams.get('locale');

    if (!id || !locale) {
      return NextResponse.json({ error: 'Missing id or locale' }, { status: 400 });
    }

    logger.log(`PUT request received with id=${id}, locale=${locale}`);

    const body = await request.json();
    const validatedBody = putServiceSchema.parse(body);
    const { data: domainData } = validatedBody;

    logger.log(`data after validation ${JSON.stringify(domainData)}`);

    const persistenceData = ServiceMapper.toPersistence(domainData);

    const updatedService = await serviceService.updateService(id, persistenceData, locale);
    logger.log(`updatedService ${JSON.stringify(updatedService)} `)

    if (!updatedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    revalidateTag(CACHE_TAGS.SERVICES); // Ensured revalidateTag is called
    return NextResponse.json(updatedService);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      logger.error('Validation error updating service:', error.issues);
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    logger.error(`Error updating service: ${error} `);
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

    logger.log(`Deleting service: ${validatedId} for locale: ${validatedLocale} `);
    const deletedService = await serviceService.deleteService(validatedId, validatedLocale);
    if (!deletedService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    revalidateTag(CACHE_TAGS.SERVICES); // Ensured revalidateTag is called and uncommented

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    logger.error(`Error deleting service: ${error} `);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
