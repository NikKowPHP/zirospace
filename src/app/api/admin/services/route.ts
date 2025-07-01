import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache'; // Ensured this import is present
import { CACHE_TAGS } from '@/lib/utils/cache'; // Ensured this import is present
import { serviceService } from '@/lib/services/service.service';

import logger from '@/lib/logger';

import { z } from 'zod';
import { Locale } from '@/i18n';

export const dynamic = 'force-dynamic'
// Define Zod schema for POST request body

const serviceLocaleSchema = z.object({
  locale: z.string(),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale');

    const validatedParams = serviceLocaleSchema.safeParse({ locale });

    if (!validatedParams.success) {
      logger.error('Validation error fetching all services:', validatedParams.error.issues);
      return NextResponse.json({ error: 'Validation error', details: validatedParams.error.issues }, { status: 400 });
    }

    const { locale: validatedLocale } = validatedParams.data;

    console.log('processing service get request for all services', { locale: validatedLocale });
    logger.log(`Fetching all services for locale: ${validatedLocale}`);
    const services = await serviceService.getServices(validatedLocale as Locale);
    return NextResponse.json(services);
  } catch (error: unknown) {
    logger.error(`Error fetching service: ${error}`);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}


const postServiceSchema = z.object({
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
    order_index: z.coerce.number().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
     logger.log('body', body)
    const validatedBody = postServiceSchema.parse(body);
    logger.log('Processing service creation', validatedBody);

  const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale');

    const id = crypto.randomUUID();
    validatedBody.id = id;

    const newService = await serviceService.createService(validatedBody, locale as Locale);

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
