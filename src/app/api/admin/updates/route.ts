import { NextRequest, NextResponse } from 'next/server';
import { UpdateService } from '@/lib/services/update.service';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';
import logger from '@/lib/logger';
import { validateLocale } from '@/lib/utils/locale';
import { Locale } from '@/i18n';

export const dynamic = 'force-dynamic'


const updateService = new UpdateService();

async function fetchLocale(request: NextRequest) : Promise<Locale | null> {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');
  try {
    return validateLocale(locale);
  } catch (error) {
    return null;
  }
}


export async function GET(request: NextRequest) {
  const locale = await fetchLocale(request);
  if (!locale) {
    return NextResponse.json({ error: 'Locale is required and must be "en" or "pl"' }, { status: 400 });
  }

  try {
    const updates = await updateService.getUpdates(locale);

     return NextResponse.json(updates, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const locale = await fetchLocale(request);
    if (!locale) {
      return NextResponse.json({ error: 'Locale is required and must be "en" or "pl"' }, { status: 400 });
    }

    const body = await request.json();
    logger.log('body in post ', body)
    
    const id = crypto.randomUUID().toString();
    body.id = id;
    const newUpdate = await updateService.createUpdate(body, locale);

    revalidateTag(CACHE_TAGS.UPDATES);

    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
