import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';
import { heroService } from '@/lib/services/hero.service';
import logger from '@/lib/logger';
import { HeroModel } from '@/domain/models/models';
import { Locale } from '@/i18n';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const localeParam = searchParams.get('locale');
    const locale: Locale = (localeParam === 'en' || localeParam === 'pl') ? localeParam : 'en';

    logger.log(`Fetching hero section for locale: ${locale}`);
    const heroSection = await heroService.getHero(locale);

    if (!heroSection) {
      return NextResponse.json({ error: 'Hero section not found' }, { status: 404 });
    }

    return NextResponse.json(heroSection);
  } catch (error) {
    logger.error(`Error fetching hero section: ${error}`);
    return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { data, locale, id } = await request.json();

    if (!id || !locale || (locale !== 'en' && locale !== 'pl')) {
      return NextResponse.json({ error: 'ID and valid locale are required' }, { status: 400 });
    }

    logger.log(`Updating hero section: ${id} for locale: ${locale} with data: ${JSON.stringify(data)}`);

    const updatedHero = await heroService.updateHero(id, data, locale);

    if (!updatedHero) {
      return NextResponse.json({ error: 'Hero section not found' }, { status: 404 });
    }

    revalidateTag(CACHE_TAGS.HERO);
    return NextResponse.json(updatedHero);
  } catch (error) {
    logger.error(`Error updating hero section: ${error}`);
    return NextResponse.json({ error: 'Failed to update hero section' }, { status: 500 });
  }
}