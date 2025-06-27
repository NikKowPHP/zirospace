import { NextRequest, NextResponse } from 'next/server'
import { blogPostService } from '@/lib/services/blog-post.service'
import logger from '@/lib/logger'
import { Locale } from '@/i18n'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('locale') as Locale

    if (!locale) {
      return NextResponse.json({ error: 'Locale is required' }, { status: 400 })
    }
    console.log('processing blog post get request', { locale })

    logger.log(`Fetching all blog posts for locale: ${locale}`)
    const blogPosts = await blogPostService.getBlogPosts(locale)
    logger.log('all posts', blogPosts)
    return NextResponse.json(blogPosts)
  } catch (error) {
    logger.error(`Error fetching blog post: ${error}`)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}
