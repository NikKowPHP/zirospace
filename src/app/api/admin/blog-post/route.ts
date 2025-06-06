import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { getBlogPostService } from '@/lib/services/blog-post.service'
import { BlogPostMapper } from '@/infrastructure/mappers/blog-post.mapper'
import logger from '@/lib/logger'
const blogPostService =  getBlogPostService()

export async function POST(request: NextRequest) {
  const { data, locale } = await request.json()
  console.log('Processing blog post creation', data)
  try {
    console.log('Processing blog post creation:', {
      locale,
      mappedData: BlogPostMapper.toPersistence(data)
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
    const id = searchParams.get('id')
    const locale = searchParams.get('locale')

       if (!locale) {
      return NextResponse.json({ error: 'Locale is required' }, { status: 400 });
    }
    console.log('processing blog post get request', {id, locale})


   if (id) {
      // Case 1: Fetch single blog post by ID
      logger.log(`Fetching blog post by ID: ${id} for locale: ${locale}`);
      const blogPost = await blogPostService.getBlogPostById(id, locale);
      if (!blogPost) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      return NextResponse.json(blogPost);
    } else {
      // Case 2: Fetch all blog posts for the locale
      logger.log(`Fetching all blog posts for locale: ${locale}`);
      const blogPosts = await blogPostService.getBlogPosts(locale);
      return NextResponse.json(blogPosts);
    }
  } catch (error) {
    logger.error(`Error fetching blog post: ${error}`)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { data, locale, id } = await request.json()
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
    //  return NextResponse.json({error:'fuck o'})
  } catch (error) {
    logger.error(`Error updating blog post: ${error}`)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const locale = searchParams.get('locale')

    if (!id || !locale) {
      return NextResponse.json({ error: 'ID and locale are required' }, { status: 400 })
    }

    logger.log(`Deleting blog post: ${id} for locale: ${locale}`)
    const deletedBlogPost = await blogPostService.deleteBlogPost(id, locale)
    if (!deletedBlogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.BLOG_POSTS)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error(`Error deleting blog post: ${error}`)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
