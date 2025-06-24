import { Locale } from '@/i18n'
import { BlogPost } from '@/domain/models/blog-post.model'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export class BlogPostService {
  private getModel(locale: Locale) {
    return locale === 'pl' ? prisma.blogPostPL : prisma.blogPostEN
  }

  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getBlogPosts(locale: Locale): Promise<BlogPost[]> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findMany({
          orderBy: { created_at: 'desc' },
        })
      },
      `blog-posts-${locale}`,
      [CACHE_TAGS.BLOG_POSTS, `blog-posts:${locale}`]
    )
    return cachedFn(locale)
  }

  async getBlogPostBySlug(slug: string, locale: Locale): Promise<BlogPost | null> {
    const cachedFn = this.withCache(
      async (slug: string, locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findFirst({
          where: { slug },
        })
      },
      `blog-post-${slug}-${locale}`,
      [CACHE_TAGS.BLOG_POSTS, `blog-post:${slug}:${locale}`]
    )
    return cachedFn(slug, locale)
  }

  async getBlogPostById(id: string, locale: Locale): Promise<BlogPost | null> {
    const cachedFn = this.withCache(
      async (id: string, locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findUnique({
          where: { id },
        })
      },
      `blog-post-${id}-${locale}`,
      [CACHE_TAGS.BLOG_POSTS, `blog-post:${id}:${locale}`]
    )
    return cachedFn(id, locale)
  }

  async createBlogPost(blogPost: Omit<BlogPost, 'id'>, locale: Locale): Promise<BlogPost> {
    const model = this.getModel(locale)
    blogPost.createdAt = new Date().toISOString()
    const trimmedBlogPost = this.trimBlogPost(blogPost)
    return (model as any).create({
      data: trimmedBlogPost as any,
    })
  }

  async updateBlogPost(id: string, blogPost: Partial<BlogPost>, locale: Locale): Promise<BlogPost> {
    const model = this.getModel(locale)
    const trimmedBlogPost = this.trimBlogPost(blogPost)
    return (model as any).update({
      where: { id },
      data: trimmedBlogPost as any,
    })
  }

  async deleteBlogPost(id: string, locale: Locale): Promise<boolean> {
    const model = this.getModel(locale)
    try {
      await (model as any).delete({
        where: { id },
      })
      return true
    } catch (error) {
      return false
    }
  }

  private trimBlogPost(blogPost: Partial<BlogPost>): Partial<BlogPost> {
    return Object.fromEntries(
      Object.entries(blogPost)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    ) as Partial<BlogPost>
  }

  async pinBlogPost(postIdToPin: string, locale: Locale): Promise<BlogPost> {
    return prisma.$transaction(async (tx) => {
      const txModel = locale === 'pl' ? tx.blogPostPL : tx.blogPostEN;
      // Unpin any currently pinned post for the given locale
      await (txModel as any).updateMany({
        where: { isPinned: true, locale },
        data: { isPinned: false },
      });

      // Pin the target post
      const pinnedPost = await (txModel as any).update({
        where: { id: postIdToPin },
        data: { isPinned: true },
      });
      return pinnedPost;
    });
  }
}

export const blogPostService = new BlogPostService()