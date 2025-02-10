import { BlogPost } from "@/domain/models/blog-post.model"

export interface IBlogPostRepository {
  getBlogPosts: (locale: string) => Promise<BlogPost[]>
  getBlogPostBySlug: (slug: string, locale: string) => Promise<BlogPost | null>
  createBlogPost: (blogPost: Omit<BlogPost, 'id'>, locale: string) => Promise<BlogPost>
  updateBlogPost: (id: string, blogPost: BlogPost, locale: string) => Promise<BlogPost | null>
  deleteBlogPost: (id: string, locale: string) => Promise<boolean>
}