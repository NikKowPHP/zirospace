// src/app/api/admin/blog-post/[id]/pin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { getBlogPostService } from '@/lib/services/blog-post.service'
import logger from '@/lib/logger'
import { BlogPost } from '@/domain/models/blog-post.model'
import { Locale } from '@/i18n' // Assuming Locale type is exported from your i18n setup

const blogPostService = getBlogPostService()

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

    // 1. Get all blog posts for the locale to find the currently pinned one
    const allPostsInLocale = await blogPostService.getBlogPosts(locale);
    let currentlyPinnedPost: BlogPost | undefined = undefined;

    for (const post of allPostsInLocale) {
      if (post.isPinned && post.id !== postIdToPin) {
        currentlyPinnedPost = post;
        break;
      }
    }

    // 2. If a different post is currently pinned, unpin it
    if (currentlyPinnedPost) {
      logger.log(`Unpinning previously pinned post: ${currentlyPinnedPost.id} for locale: ${locale}`);
      await blogPostService.updateBlogPost(currentlyPinnedPost.id, { isPinned: false }, locale);
    }

    // 3. Pin the target post
    // First, fetch the target post to ensure it exists and get its current data
    const targetPost = await blogPostService.getBlogPostById(postIdToPin, locale);
    if (!targetPost) {
        return NextResponse.json({ error: `Blog post with ID ${postIdToPin} not found for locale ${locale}` }, { status: 404 });
    }

    // If the target post is already pinned, we can consider this a successful no-op or simply re-apply.
    // For simplicity, we'll re-apply. If it's not pinned, this will pin it.
    logger.log(`Pinning target post: ${postIdToPin} for locale: ${locale}`);
    const updatedPinnedPost = await blogPostService.updateBlogPost(postIdToPin, { isPinned: true }, locale);

    if (!updatedPinnedPost) {
        // This case should ideally not happen if the targetPost was found,
        // but it's good for robustness.
        return NextResponse.json({ error: `Failed to pin blog post with ID ${postIdToPin}` }, { status: 500 });
    }

    // Revalidate cache tags
    revalidateTag(CACHE_TAGS.BLOG_POSTS); // General tag for all blog posts
    revalidateTag(`${CACHE_TAGS.BLOG_POSTS}-${locale}`); // Locale-specific tag
    // Optionally, revalidate individual post tags if you use them
    if (currentlyPinnedPost) {
        revalidateTag(`${CACHE_TAGS.BLOG_POSTS}-${locale}-${currentlyPinnedPost.slug}`);
    }
    revalidateTag(`${CACHE_TAGS.BLOG_POSTS}-${locale}-${updatedPinnedPost.slug}`);


    return NextResponse.json({
      message: `Blog post ${postIdToPin} pinned successfully.`,
      pinnedPost: updatedPinnedPost,
      unpinnedPost: currentlyPinnedPost ? currentlyPinnedPost.id : null,
    });

  } catch (error) {
    logger.error('Error pinning blog post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to pin blog post';
    return NextResponse.json({ error: errorMessage, details: error instanceof Error ? error.stack : null }, { status: 500 });
  }
}