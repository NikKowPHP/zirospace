// src/app/api/admin/blog-post/[id]/pin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { blogPostService } from '@/lib/services/blog-post.service'
import logger from '@/lib/logger'
import { Locale } from '@/i18n' // Assuming Locale type is exported from your i18n setup



export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: postIdToPin } = params;
    const { locale } = (await request.json()) as { locale: Locale };

    if (!postIdToPin || !locale) {
      return NextResponse.json(
        { error: 'Post ID and locale are required' },
        { status: 400 }
      );
    }

    logger.log(`Attempting to pin blog post: ${postIdToPin} for locale: ${locale}`);

    const updatedPinnedPost = await blogPostService.pinBlogPost(postIdToPin, locale);

    if (!updatedPinnedPost) {
      return NextResponse.json({ error: `Failed to pin blog post with ID ${postIdToPin}` }, { status: 500 });
    }

    // Revalidate cache tags
    revalidateTag(CACHE_TAGS.BLOG_POSTS); // General tag for all blog posts
    revalidateTag(`${CACHE_TAGS.BLOG_POSTS}-${locale}`); // Locale-specific tag
    revalidateTag(`${CACHE_TAGS.BLOG_POSTS}-${locale}-${updatedPinnedPost.slug}`);

    return NextResponse.json({
      message: `Blog post ${postIdToPin} pinned successfully.`,
      pinnedPost: updatedPinnedPost,
    });

  } catch (error) {
    logger.error('Error pinning blog post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to pin blog post';
    return NextResponse.json({ error: errorMessage, details: error instanceof Error ? error.stack : null }, { status: 500 });
  }
}