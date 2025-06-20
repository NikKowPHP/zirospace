import { NextRequest, NextResponse } from 'next/server';
import { UpdateService } from '@/lib/services/update.service';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(3),
  publish_date: z.preprocess((arg) => new Date(arg as string), z.date()),
  content_html: z.string().optional(),
  excerpt: z.string().optional(),
  image_url: z.string().optional(),
  image_alt: z.string().optional(),
  is_published: z.boolean().default(false),
  order_index: z.number().default(0),
  created_at: z.preprocess((arg) => new Date(arg as string), z.date()),
  updated_at: z.preprocess((arg) => new Date(arg as string), z.date()),
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

    const update = await updateService.createUpdate({
      ...result.data,
      content_html: result.data.content_html ?? null,
      excerpt: result.data.excerpt ?? null,
      image_url: result.data.image_url ?? null,
      image_alt: result.data.image_alt ?? null,
    }, locale);
    revalidateTag(CACHE_TAGS.UPDATES);
    return NextResponse.json(update, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
