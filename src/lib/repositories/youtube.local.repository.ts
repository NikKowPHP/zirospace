import { BlogPost } from '@/domain/models/blog-post.model';
import { BlogPostMapper } from '@/infrastructure/mappers/blog-post.mapper';
import { IBlogPostRepository } from '@/lib/interfaces/blog-post.interface';
import logger from '@/lib/logger'
import { getDatabaseFilePath } from '@/lib/config/database.config';
import { Database } from 'sqlite3';
import { SqlLiteAdapter } from './adapters/sqllite.adapter';
const dbPath = getDatabaseFilePath();
const db = new Database(dbPath);

export class BlogPostRepositoryLocal extends SqlLiteAdapter<BlogPost, string> implements IBlogPostRepository {
  constructor() {
    super("blog_posts", db);
  }

  async getBlogPosts(locale: string): Promise<BlogPost[]> {
    const blogPosts = await this.list(locale)
    return blogPosts
  }

  async getBlogPostBySlug(slug: string, locale: string): Promise<BlogPost | null> {
    try {
      const query = `SELECT * FROM blog_posts_${locale} WHERE slug = ?`;
      console.log('query with slug', query, slug)
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
      logger.log(`Error fetching blog post with slug ${slug}:`, error);
      throw new Error(`Failed to fetch blog post: ${error.message}`);
    }
  }

  async getBlogPostById(id: string, locale: string): Promise<BlogPost | null> {
    try {
      const query = `SELECT * FROM blog_posts_${locale} WHERE id = ?`;
      const result = await new Promise<any>((resolve, reject) => {
        this.db.get(query, [id], (err, row) => {
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
      logger.log(`Error fetching blog post with id ${id}:`, error);
      throw new Error(`Failed to fetch blog post: ${error.message}`);
    }
  }

  async createBlogPost(blogPost: Omit<BlogPost, 'id'>, locale: string ): Promise<BlogPost> {
    try {
      const query = `
        INSERT INTO blog_posts_${locale} (title, slug, image_url, created_at, image_alt, excerpt, content_html)
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
        id: Date.now().toString(), // Mock ID generation
        ...blogPost,
      };
    } catch (error: any) {
      logger.log(`Error creating blog post:`, error);
      throw new Error(`Failed to create blog post: ${error.message}`);
    }
  }

  async updateBlogPost(id: string, blogPost: Partial<BlogPost>, locale: string): Promise<BlogPost | null> {
    try {
      const updates: string[] = [];
      const params: any[] = [];

      // Convert to persistence DTO and only include the fields that are being updated
      const persistenceBlogPost = BlogPostMapper.toPersistence({
        ...await this.getBlogPostById(id, locale), // Get existing post
        ...blogPost // Merge with updates
      } as BlogPost);

      // Remove id from the persistence object to prevent update
      // delete persistenceBlogPost.id;

      for (const [key, value] of Object.entries(persistenceBlogPost)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          params.push(value);
        }
      }

      if (updates.length === 0) {
        return this.getBlogPostById(id, locale);
      }

      params.push(id);

      const query = `
        UPDATE blog_posts_${locale}
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

      return this.getBlogPostById(id, locale);
    } catch (error: any) {
      logger.log(`Error updating blog post with id ${id}:`, error);
      throw new Error(`Failed to update blog post: ${error.message}`);
    }
  }

  async deleteBlogPost(id: string, locale: string): Promise<boolean> {
    try {
      const query = `DELETE FROM blog_posts_${locale} WHERE id = ?`;

      console.log('query with id', query, id)
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
      logger.log(`Error deleting blog post with id ${id}:`, error);
      throw new Error(`Failed to delete blog post: ${error.message}`);
    }
  }

  async list(locale: string): Promise<BlogPost[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM blog_posts_${locale}`;
      

      this.db.all(query, [], (err, rows: any[]) => {
        if (err) {
          logger.log(`Error listing blog posts:`, err);
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