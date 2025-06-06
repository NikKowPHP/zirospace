import { NextRequest, NextResponse } from 'next/server';
import { UpdateService } from '@/lib/services/update.service';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';
import { z } from 'zod';
import logger from '@/lib/logger';

const updateSchema = z.object({
  title: z.string().min(3),
  publish_date: z.string(),
  content_html: z.string().optional(),
  excerpt: z.string().optional(),
  image_url: z.string().optional(),
  image_alt: z.string().optional(),
  is_published: z.boolean().default(false),
  order_index: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
});

const updateService = new UpdateService();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');

  if (!locale || (locale !== 'en' && locale !== 'pl')) {
    return NextResponse.json({ error: 'Locale is required and must be "en" or "pl"' }, { status: 400 });
  }

  try {
    const updates = await updateService.getUpdates(locale);
    return NextResponse.json(updates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');

  if (!locale || (locale !== 'en' && locale !== 'pl')) {
    return NextResponse.json({ error: 'Locale is required and must be "en" or "pl"' }, { status: 400 });
  }

  try {
    const json = await request.json();
    const result = updateSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(result.error, { status: 400 });
    }

    const { publish_date, ...rest } = result.data;
    logger.log(rest)
    const { publish_date: pubDate, ...updateData } = result.data;
    const update = await updateService.createUpdate({
      ...updateData,
      publish_date: new Date(pubDate),
      content_html: updateData.content_html ?? null,
      excerpt: updateData.excerpt ?? null,
      image_url: updateData.image_url ?? null,
      image_alt: updateData.image_alt ?? null,
    }, locale);
    revalidateTag(CACHE_TAGS.UPDATES);
    return NextResponse.json(update, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');

  if (!locale || (locale !== 'en' && locale !== 'pl')) {
    return NextResponse.json({ error: 'Locale is required and must be "en" or "pl"' }, { status: 400 });
  }

  try {
    const json = await request.json();
    const result = updateSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(result.error, { status: 400 });
    }

    // const { publish_date, ...rest } = result.data;

    const { publish_date: pubDate, ...updateData } = result.data;
    const update = await updateService.updateUpdate(
      params.id,
      {
        ...updateData,
        publish_date: new Date(pubDate),
        content_html: updateData.content_html ?? null,
        excerpt: updateData.excerpt ?? null,
        image_url: updateData.image_url ?? null,
        image_alt: updateData.image_alt ?? null,
      },
      locale
    );
    revalidateTag(CACHE_TAGS.UPDATES);
    return NextResponse.json(update, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');

  if (!locale || (locale !== 'en' && locale !== 'pl')) {
    return NextResponse.json({ error: 'Locale is required and must be "en" or "pl"' }, { status: 400 });
  }

  try {
    await updateService.deleteUpdate(params.id, locale);
    revalidateTag(CACHE_TAGS.UPDATES);
    return NextResponse.json({}, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}