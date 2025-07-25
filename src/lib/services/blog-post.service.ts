import { Locale } from '@/i18n'
import { BlogPost } from '@/domain/models/models'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export class BlogPostService {
  private getModel(locale: Locale) {
    return locale === 'pl' ? prisma.zirospace_blog_posts_pl : prisma.zirospace_blog_posts_en
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
        const idNum = parseInt(id);
        return (model as any).findUnique({
          where: { id:idNum },
        })
      },
      `blog-post-${id}-${locale}`,
      [CACHE_TAGS.BLOG_POSTS, `blog-post:${id}:${locale}`]
    )
    return cachedFn(id, locale)
  }

  async createBlogPost(blogPost: Omit<BlogPost, 'id'>, locale: Locale): Promise<BlogPost> {
    const model = this.getModel(locale)
    blogPost.created_at = new Date().toISOString()
    const trimmedBlogPost = this.trimBlogPost(blogPost)
    return (model as any).create({
      data: trimmedBlogPost as any,
    })
  }

  async updateBlogPost(id: string, blogPost: Partial<BlogPost>, locale: Locale): Promise<BlogPost> {
    const model = this.getModel(locale)
    const trimmedBlogPost = this.trimBlogPost(blogPost)
      const idNum = parseInt(id);
    return (model as any).update({
      where: { id:idNum },
      data: trimmedBlogPost as any,
    })
  }

  async deleteBlogPost(id: string, locale: Locale): Promise<boolean> {
    const model = this.getModel(locale)
    try {
        const idNum = parseInt(id);
      await (model as any).delete({
        where: { id:idNum },
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
      const txModel = locale === 'pl' ? tx.zirospace_blog_posts_pl : tx.zirospace_blog_posts_en;
      // Unpin any currently pinned post for the given locale
      await (txModel as any).updateMany({
        where: { is_pinned: true, locale },
        data: { is_pinned: false },
      });
      const idNum = parseInt(postIdToPin)

      // Pin the target post
      const pinnedPost = await (txModel as any).update({
        where: { id: idNum },
        data: { is_pinned: true },
      });
      return pinnedPost;
    });
  }
}

export const blogPostService = new BlogPostService()