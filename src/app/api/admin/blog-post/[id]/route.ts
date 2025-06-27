import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { blogPostService } from '@/lib/services/blog-post.service'
import logger from '@/lib/logger'
import { Locale } from '@/i18n'
export const dynamic = 'force-dynamic'
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('locale') as Locale

    if (!id || !locale) {
      return NextResponse.json({ error: 'ID and locale are required' }, { status: 400 })
    }

    logger.log(`Fetching blog post by ID: ${id} for locale: ${locale}`)
    const blogPost = await blogPostService.getBlogPostById(id, locale)
    if (!blogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    return NextResponse.json(blogPost)
  } catch (error) {
    logger.error(`Error fetching blog post: ${error}`)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { data, locale } = await request.json()
    logger.log(`updating blog post: ${id} ${locale} with data: ${JSON.stringify(data)}`)
    if (!id || !locale) {
      return NextResponse.json({ error: 'ID and locale are required' }, { status: 400 })
    }

    const updatedBlogPost = await blogPostService.updateBlogPost(id, data, locale)

    if (!updatedBlogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.BLOG_POSTS)
    return NextResponse.json(updatedBlogPost)
  } catch (error) {
    logger.error(`Error updating blog post: ${error}`)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get('locale') as Locale

    if (!id || !locale) {
      return NextResponse.json({ error: 'ID and locale are required' }, { status: 400 })
    }

    logger.log(`Deleting blog post: ${id} for locale: ${locale}`)
    const deletedBlogPost = await blogPostService.deleteBlogPost(id, locale)
    if (!deletedBlogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.BLOG_POSTS)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error(`Error deleting blog post: ${error}`)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}