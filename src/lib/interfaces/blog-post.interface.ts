import { BlogPost } from "@/domain/models/blog-post.model"

export interface IBlogPostRepository {
  getBlogPosts: () => Promise<BlogPost[]>
  getBlogPostBySlug: (slug: string) => Promise<BlogPost | null>
  createBlogPost: (blogPost: Omit<BlogPost, 'id'>) => Promise<BlogPost>
  updateBlogPost: (id: string, blogPost: Partial<BlogPost>) => Promise<BlogPost | null>
  deleteBlogPost: (id: string) => Promise<boolean>
}