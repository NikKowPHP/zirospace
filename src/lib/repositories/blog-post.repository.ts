// src/lib/repositories/blog-post.repository.ts
import { unstable_cache } from 'next/cache'
import { PrismaClient } from '@prisma/client'
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache'
import prisma from '@/lib/prisma'
import { BlogPost } from '@/domain/models/models' // Use updated domain model
import logger from '@/lib/logger'

export interface IBlogPostRepository {
  getBlogPosts(locale: string): Promise<BlogPost[]>
  getBlogPostBySlug(slug: string, locale: string): Promise<BlogPost | null>
  // Adjust Omit based on the BlogPost interface
  createBlogPost(blogPost: Omit<BlogPost, 'id' | 'created_at'>, locale: string): Promise<BlogPost>
  updateBlogPost(id: string, blogPost: Partial<Omit<BlogPost, 'id' | 'created_at' | 'locale'>>): Promise<BlogPost | null> // Usually don't update created_at or locale via partial update
  getBlogPostById(id: string, locale: string): Promise<BlogPost | null>
  deleteBlogPost(id: string): Promise<boolean>
}

export class BlogPostRepository implements IBlogPostRepository {
  private prisma: PrismaClient

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient
  }

  getBlogPosts = unstable_cache(
    async (locale: string): Promise<BlogPost[]> => {
      try {
        // Prisma result now directly matches the BlogPost interface
        const blogPosts = await this.prisma.blogPost.findMany({
          where: { locale: locale },
          orderBy: { created_at: 'desc' },
        })
        return blogPosts; // No mapping needed
      } catch (error) {
        logger.log('Error fetching blog posts with Prisma:', error)
        return []
      }
    },
    [`blog-posts-${(Math.random() + 1).toString(36).substring(7)}`],
    {
      revalidate: CACHE_TIMES.MINUTE,
      tags: [CACHE_TAGS.BLOG_POSTS, `blog-posts-${(Math.random() + 1).toString(36).substring(7)}`],
    }
  )

  async getBlogPostBySlug(slug: string, locale: string): Promise<BlogPost | null> {
    try {
      // Prisma result now directly matches the BlogPost interface
      const post = await this.prisma.blogPost.findUnique({
        where: {
          slug_locale: { // Use the @@unique index
            slug: slug,
            locale: locale,
          },
        },
      })
      return post; // No mapping needed (null is handled implicitly)
    } catch (error) {
      logger.log('Error fetching blog post by slug with Prisma:', error)
      return null
    }
  }

  // Input 'blogPost' uses the updated interface structure (e.g., blogPost.image_url)
  async createBlogPost(blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>, locale: string): Promise<BlogPost> {
    // Data object uses field names matching Prisma schema / updated domain model
    const createData = {
      slug: blogPost.slug,
      title: blogPost.title,
      image_url: blogPost.image_url,
      image_alt: blogPost.image_alt, // Already correct type (string | null)
      excerpt: blogPost.excerpt,
      content_html: blogPost.content_html,
      is_pinned: blogPost.is_pinned || false,
      locale: locale,
      // created_at and updated_at handled by Prisma defaults/triggers
    };

    try {
      // Prisma result now directly matches the BlogPost interface
      const createdPost = await this.prisma.blogPost.create({
        data: createData,
      })
      return createdPost; // No mapping needed
    } catch (error) {
      logger.log('Error creating blog post with Prisma:', error)
      throw new Error(`Failed to create blog post: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Input 'blogPost' uses the updated interface structure (e.g., blogPost.image_url)
  async updateBlogPost(id: string, blogPost: Partial<Omit<BlogPost, 'id' | 'created_at' | 'locale'>>): Promise<BlogPost | null> {
    // Data object uses field names matching Prisma schema / updated domain model
    // Prisma doesn't have updated_at for BlogPost
    const updateData: Partial<Omit<BlogPost, 'id' | 'created_at' | 'locale'>> = {
      ...blogPost // Spread the partial data directly
    };

    try {
      // Prisma result now directly matches the BlogPost interface
      const updatedPost = await this.prisma.blogPost.update({
        where: { id: id /* , locale: locale */ }, // Ensure this ID belongs to the expected locale if necessary.
        data: updateData,
      })
      return updatedPost; // No mapping needed
    } catch (error) {
      logger.log(`Error updating blog post with ID ${id} using Prisma:`, error)
      return null
    }
  }

  async getBlogPostById(id: string, locale: string): Promise<BlogPost | null> {
    try {
      // Prisma result now directly matches the BlogPost interface
      const post = await this.prisma.blogPost.findUnique({
        where: { id: id },
      })

      if (!post || post.locale !== locale) {
        logger.log(`Blog post with ID ${id} not found or locale mismatch (expected ${locale}, found ${post?.locale})`)
        return null
      }

      return post; // No mapping needed
    } catch (error) {
      logger.log(`Error fetching blog post by ID ${id} with Prisma:`, error)
      return null
    }
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      await this.prisma.blogPost.delete({
        where: { id: id }, // ID is unique, locale check isn't needed here for delete
      })
      return true
    } catch (error) {
      logger.log(`Error deleting blog post with ID ${id} using Prisma:`, error)
      return false
    }
  }
}

// Export singleton instance using the shared prisma client
export const blogPostRepository = new BlogPostRepository(prisma)
