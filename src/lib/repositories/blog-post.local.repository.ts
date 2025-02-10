import { BlogPost } from '@/domain/models/blog-post.model';
import { BlogPostMapper } from '@/infrastructure/mappers/blog-post.mapper';
import { IBlogPostRepository } from '@/lib/interfaces/blog-post.interface';

import { getDatabaseFilePath } from '@/lib/config/database.config';
import { Database } from 'sqlite3';
import { SqlLiteAdapter } from './adapters/sqllite.adapter';
const dbPath = getDatabaseFilePath();
const db = new Database(dbPath);

export class BlogPostRepositoryLocal extends SqlLiteAdapter<BlogPost, number> implements IBlogPostRepository {
  constructor() {
    super("blog_posts", db);
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    const blogPosts = await this.list()
    console.log('blogPosts in repository ', blogPosts)
    return blogPosts
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const query = `SELECT * FROM blog_posts WHERE slug = ?`;
      const result = await new Promise<any>((resolve, reject) => {
        this.db.get(query, [slug], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row);
        });
      });

      if (!result) {
        return null;
      }

      return BlogPostMapper.toDomain(result);
    } catch (error: any) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      throw new Error(`Failed to fetch blog post: ${error.message}`);
    }
  }

  async createBlogPost(blogPost: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    try {
      const query = `
        INSERT INTO blog_posts (title, slug, imageurl, createdAt, imageAlt, excerpt, contentHtml)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        blogPost.title,
        blogPost.slug,
        blogPost.imageurl,
        blogPost.createdAt,
        blogPost.imageAlt,
        blogPost.excerpt,
        blogPost.contentHtml,
      ];

      await new Promise<void>((resolve, reject) => {
        this.db.run(query, params, function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      return {
        id: Date.now(), // Mock ID generation
        ...blogPost,
      };
    } catch (error: any) {
      console.error(`Error creating blog post:`, error);
      throw new Error(`Failed to create blog post: ${error.message}`);
    }
  }

  async updateBlogPost(id: string, blogPost: Partial<BlogPost>): Promise<BlogPost | null> {
    try {
      const updates: string[] = [];
      const params: any[] = [];

      for (const key in blogPost) {
        if (blogPost.hasOwnProperty(key) && key !== 'id') {
          updates.push(`${key} = ?`);
          params.push((blogPost as any)[key]);
        }
      }

      if (updates.length === 0) {
        return this.getBlogPostBySlug(blogPost.slug || '');
      }

      params.push(id);

      const query = `
        UPDATE blog_posts
        SET ${updates.join(', ')}
        WHERE id = ?
      `;

      await new Promise<void>((resolve, reject) => {
        this.db.run(query, params, function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      return this.getBlogPostBySlug(blogPost.slug || '');
    } catch (error: any) {
      console.error(`Error updating blog post with id ${id}:`, error);
      throw new Error(`Failed to update blog post: ${error.message}`);
    }
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      const query = `DELETE FROM blog_posts WHERE id = ?`;

      await new Promise<void>((resolve, reject) => {
        this.db.run(query, [id], function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      return true;
    } catch (error: any) {
      console.error(`Error deleting blog post with id ${id}:`, error);
      throw new Error(`Failed to delete blog post: ${error.message}`);
    }
  }

  async list(): Promise<BlogPost[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM blog_posts`;

      this.db.all(query, [], (err, rows: any[]) => {
        if (err) {
          console.error(`Error listing blog posts:`, err);
          reject(new Error(`Database error listing blog posts: ${err.message || 'Unknown error'}`));
          return;
        }
        const blogPosts = rows.map(BlogPostMapper.toDomain);
        resolve(blogPosts || []);
      });
    });
  }
}

// export singleton
export const blogPostRepositoryLocal = new BlogPostRepositoryLocal();