import { unstable_cache } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache'
import { supabase } from '../supabase'
import { BlogPostDTO } from '@/infrastructure/dto/blog-post.dto'
import { BlogPostMapper } from '@/infrastructure/mappers/blog-post.mapper'
import { BlogPost } from '@/domain/models/blog-post.model'
import { IBlogPostRepository } from '@/lib/interfaces/blog-post.interface'

export class BlogPostRepository implements IBlogPostRepository {
  private supabaseClient: SupabaseClient

  constructor() {
    this.supabaseClient = supabase
  }

  getBlogPosts = unstable_cache(
    async (): Promise<BlogPost[]> => {
      const { data, error } = await this.supabaseClient
        .from('blog_posts')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) {
        console.error('Error fetching blog posts:', error)
        return []
      }

      return (data as BlogPostDTO[]).map(BlogPostMapper.toDomain)
    },
    [CACHE_TAGS.BLOG_POSTS],
    {
      revalidate: CACHE_TIMES.HOUR,
      tags: [CACHE_TAGS.BLOG_POSTS],
    }
  )

  getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    const { data, error } = await this.supabaseClient
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching blog post by slug:', error)
      return null
    }

    if (!data) {
      return null
    }

    return BlogPostMapper.toDomain(data as BlogPostDTO)
  }

  createBlogPost = async (blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    const { data, error } = await this.supabaseClient
      .from('blog_posts')
      .insert([
        {
          title: blogPost.title,
          slug: blogPost.slug,
          imageurl: blogPost.imageurl,
          createdAt: blogPost.createdAt,
          imageAlt: blogPost.imageAlt,
          excerpt: blogPost.excerpt,
          contentHtml: blogPost.contentHtml,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      throw new Error('Failed to create blog post')
    }

    return BlogPostMapper.toDomain(data as BlogPostDTO)
  }

  updateBlogPost = async (id: string, blogPost: Partial<BlogPost>): Promise<BlogPost | null> => {
    const { data, error } = await this.supabaseClient
      .from('blog_posts')
      .update({
        title: blogPost.title,
        slug: blogPost.slug,
        imageurl: blogPost.imageurl,
        createdAt: blogPost.createdAt,
        imageAlt: blogPost.imageAlt,
        excerpt: blogPost.excerpt,
        contentHtml: blogPost.contentHtml,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      return null
    }

    if (!data) {
      return null
    }

    return BlogPostMapper.toDomain(data as BlogPostDTO)
  }

  deleteBlogPost = async (id: string): Promise<boolean> => {
    const { error } = await this.supabaseClient
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return false
    }

    return true
  }
}

// export singleton
export const blogPostRepository = new BlogPostRepository()