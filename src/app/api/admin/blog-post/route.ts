import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import { getBlogPostService } from '@/lib/services/blog-post.service'
import { logger } from '@/lib/utils/logger'

const blogPostService = await getBlogPostService()

export async function POST(request: NextRequest) {
  const { data, locale } = await request.json()
  
  try {
    console.log('Processing case study creation:', {
      locale,
      mappedData: CaseStudyMapper.toPersistence(data)
    })

    const newBlogPost = await blogPostService.createBlogPost(data, locale)

    // Revalidate cache
    revalidateTag(CACHE_TAGS.BLOG_POSTS)

    return NextResponse.json(newBlogPost)
  } catch (error) {
    console.error('Error creating case study:', error)
    return NextResponse.json(
      { error: 'Failed to create case study', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }



}

export async function GET(request: NextRequest) {
  try {
        const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')
    const locale = searchParams.get('locale')
    console.log(`Fetching blog post: ${slug} ${locale}`)
    if(!slug || !locale) {
      return NextResponse.json({ error: 'Slug and locale are required' }, { status: 400 })
    }

    logger.log(`Fetching blog post: ${slug} ${locale}`)
    const blogPost = await blogPostService.getBlogPostBySlug(slug, locale)
    return NextResponse.json(blogPost)
  } catch (error) {
    logger.error(`Error fetching blog post: ${error}`)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}