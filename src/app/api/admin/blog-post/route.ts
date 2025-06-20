import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { blogPostService } from '@/lib/services/blog-post.service'

import logger from '@/lib/logger'
import { Locale } from '@/i18n'


export async function POST(request: NextRequest) {
  const { data, locale } = await request.json()
  console.log('Processing blog post creation', data)
  try {
    console.log('Processing blog post creation:', {
      locale,
      data:(data)
    })
    const id = crypto.randomUUID()
    data.id = id;

    const newBlogPost = await blogPostService.createBlogPost(data, locale)

    // Revalidate cache
    revalidateTag(CACHE_TAGS.BLOG_POSTS)

    return NextResponse.json(newBlogPost)
  } catch (error) {
    logger.log('Error creating case study:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('locale') as Locale

    if (!locale) {
      return NextResponse.json({ error: 'Locale is required' }, { status: 400 });
    }
    console.log('processing blog post get request', { locale })

    logger.log(`Fetching all blog posts for locale: ${locale}`);
    const blogPosts = await blogPostService.getBlogPosts(locale);
    return NextResponse.json(blogPosts);
  } catch (error) {
    logger.error(`Error fetching blog post: ${error}`)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}
