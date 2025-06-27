import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';
import { youtubeService } from '@/lib/services/youtube.service';
import logger from '@/lib/logger';
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    logger.log('Fetching YouTube data');
    const youtubeData = await youtubeService.getYoutube();
    if (!youtubeData) {
      return NextResponse.json({ error: 'YouTube data not found' }, { status: 404 });
    }
    return NextResponse.json(youtubeData);
  } catch (error) {
    logger.error(`Error fetching YouTube data: ${error}`);
    return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { youtube_url } = await request.json();

    if (!youtube_url) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    logger.log(`Updating YouTube URL to: ${youtube_url}`);
    const updatedYoutube = await youtubeService.updateYoutube(youtube_url);

    if (!updatedYoutube) {
      return NextResponse.json({ error: 'Failed to update YouTube data' }, { status: 500 });
    }

    revalidateTag(CACHE_TAGS.YOUTUBE);
    return NextResponse.json(updatedYoutube);
  } catch (error) {
    logger.error(`Error updating YouTube data: ${error}`);
    return NextResponse.json({ error: 'Failed to update YouTube data' }, { status: 500 });
  }
}