import { Locale } from "@/i18n"
import { BlogPost } from "@/domain/models/blog-post.model"
import { blogPostRepositoryLocal } from "@/lib/repositories/blog-post.local.repository"
import { blogPostRepository } from "@/lib/repositories/blog-post.repository"

export interface IBlogPostService {
  getBlogPosts(): Promise<BlogPost[]>
  getBlogPostBySlug(slug: string): Promise<BlogPost | null>
  createBlogPost(blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost>
  updateBlogPost(id: string, blogPost: Partial<BlogPost>): Promise<BlogPost | null>
  deleteBlogPost(id: string): Promise<boolean>
}

export class BlogPostService implements IBlogPostService {
  private blogPostRepository: any //IBlogPostRepository
  constructor() {
    if(process.env.MOCK_REPOSITORIES === 'true') {
      this.blogPostRepository = blogPostRepositoryLocal
    } else {
      this.blogPostRepository = blogPostRepository // TODO: implement postgres repo
    }
  }

  getBlogPosts = async (): Promise<BlogPost[]> => {
    return this.blogPostRepository.getBlogPosts()
  }

  getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    return this.blogPostRepository.getBlogPostBySlug(slug)
  }

  createBlogPost = async (blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    return this.blogPostRepository.createBlogPost(blogPost)
  }

  updateBlogPost = async (id: string, blogPost: Partial<BlogPost>): Promise<BlogPost | null> => {
    return this.blogPostRepository.updateBlogPost(id, blogPost)
  }

  deleteBlogPost = async (id: string): Promise<boolean> => {
    return this.blogPostRepository.deleteBlogPost(id)
  }
}

// export singleton
export const blogPostService = new BlogPostService()

export const getBlogPostService = async () => {
  return new BlogPostService()
}