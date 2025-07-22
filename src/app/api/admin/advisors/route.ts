
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { advisorService } from '@/lib/services/advisor.service'
import logger from '@/lib/logger'
import { Locale } from '@/i18n'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const { data, locale } = await request.json()
  
  try {
    const id = crypto.randomUUID()
    data.id = id;
    console.log('Processing advisor creation:', {
      locale,
      mappedData: (data)
    })

    const newAdvisor = await advisorService.createAdvisor(data, locale)

    revalidateTag(CACHE_TAGS.ADVISORS)

    return NextResponse.json(newAdvisor)
  } catch (error) {
    logger.log('Error creating advisor:', error)
    return NextResponse.json(
      { error: 'Failed to create advisor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') as Locale;

    console.log('Processing advisor retrieval:', { locale })

    const advisors = await advisorService.getAdvisors(locale);

    return NextResponse.json(advisors);
  } catch (error) {
    logger.log('Error retrieving advisors:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve advisors', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}