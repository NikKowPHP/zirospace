import { unstable_cache } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache'
import { supabase } from '../supabase'
import { BlogPostDTO } from '@/infrastructure/dto/blog-post.dto'
import { BlogPostMapper } from '@/infrastructure/mappers/blog-post.mapper'
import { BlogPost } from '@/domain/models/blog-post.model'
import { IBlogPostRepository } from '@/lib/interfaces/blog-post.interface'
import logger from '@/lib/logger'
export class BlogPostRepository implements IBlogPostRepository {
  private supabaseClient: SupabaseClient
  private tableName: string = 'zirospace_blog_posts'

  constructor() {
    this.supabaseClient = supabase
  }

  getBlogPosts = unstable_cache(
    async (locale: string): Promise<BlogPost[]> => {
      const { data, error } = await this.supabaseClient
        .from(`${this.tableName}_${locale}`)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        logger.log('Error fetching blog posts:', error)
        return []
      }

      return (data as BlogPostDTO[]).map(BlogPostMapper.toDomain)
    },
    [CACHE_TAGS.BLOG_POSTS],
    {
      revalidate: CACHE_TIMES.MINUTE,
      tags: [CACHE_TAGS.BLOG_POSTS],
    }
  )

  getBlogPostBySlug = async (slug: string, locale: string): Promise<BlogPost | null> => {
    const { data, error } = await this.supabaseClient
      .from(`${this.tableName}_${locale}`)
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      logger.log('Error fetching blog post by slug:', error)
      return null
    }

    if (!data) {
      return null
    }

    return BlogPostMapper.toDomain(data as BlogPostDTO)
  }

  createBlogPost = async (
    blogPost: Omit<BlogPost, 'id'>,
    locale: string
  ): Promise<BlogPost> => {
    const { data, error } = await this.supabaseClient
      .from(`${this.tableName}_${locale}`)
      .insert([
        {
          title: blogPost.title,
          slug: blogPost.slug,
          image_url: blogPost.imageurl,
          image_alt: blogPost.imageAlt,
          excerpt: blogPost.excerpt,
          content_html: blogPost.contentHtml,
          is_pinned: blogPost.isPinned || false,
          created_at: blogPost.createdAt,
        },
      ])
      .select()
      .single()

    if (error) {
      logger.log('Error creating blog post:', error)
      throw new Error('Failed to create blog post')
    }

    return BlogPostMapper.toDomain(data as BlogPostDTO)
  }

  updateBlogPost = async (
    id: string,
    blogPost: Partial<BlogPost>,
    locale: string
  ): Promise<BlogPost | null> => {
    const { data, error } = await this.supabaseClient
      .from(`${this.tableName}_${locale}`)
      .update({
        title: blogPost.title,
        slug: blogPost.slug,
        image_url: blogPost.imageurl,
        image_alt: blogPost.imageAlt,
        excerpt: blogPost.excerpt,
        content_html: blogPost.contentHtml,
        is_pinned: blogPost.isPinned,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.log('Error updating blog post:', error)
      return null
    }

    if (!data) {
      return null
    }

    return BlogPostMapper.toDomain(data as BlogPostDTO)
  }

  getBlogPostById = async (id: string, locale: string): Promise<BlogPost | null> => {
    const { data, error } = await this.supabaseClient
      .from(`${this.tableName}_${locale}`)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      logger.log('Error fetching blog post by id:', error)
      return null
    }

    if (!data) {
      return null
    }

    return BlogPostMapper.toDomain(data as BlogPostDTO)
  }

  deleteBlogPost = async (id: string, locale: string): Promise<boolean> => {
    const { error } = await this.supabaseClient
      .from(`${this.tableName}_${locale}`)
      .delete()
      .eq('id', id)

    if (error) {
      logger.log('Error deleting blog post:', error)
      return false
    }

    return true
  }
}

// export singleton
export const blogPostRepository = new BlogPostRepository()