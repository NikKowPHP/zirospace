import { SqlLiteAdapter } from '@/lib/repositories/adapters/sqllite.adapter';
import { Database } from 'sqlite3';
import { getDatabaseFilePath } from '@/lib/config/database.config';
import { ITestimonialRepository } from '../interfaces/testimonials.interface';
import { Testimonial } from '@/domain/models/testimonial.model';
import { TestimonialDTO } from '@/infrastructure/dto/testimonial.dto';
import { TestimonialMapper } from '@/infrastructure/mappers/testimonial.mapper';
import logger from '@/lib/logger'
const dbPath = getDatabaseFilePath();
const db = new Database(dbPath);

export class TestimonialRepositoryLocal extends SqlLiteAdapter<Testimonial, string> implements ITestimonialRepository {
  constructor() {
    super("testimonials", db);
  }

  async getTestimonials(locale: string): Promise<Testimonial[]> {
    const result = await this.list(locale)
    return result
  }

  async getTestimonialById(id: string, locale: string): Promise<Testimonial | null> {
    try {
      const tableName = `testimonials_${locale}`;
      const query = `SELECT * FROM "${tableName}" WHERE id = ?;`;

      const result = await new Promise<any>((resolve, reject) => {
        this.db.get(query, [id], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row ? { rows: [row] } : { rows: [] });
        });
      });

      if (!result || !result.rows || result.rows.length === 0) {
        return null;
      }

      return TestimonialMapper.toDomain(result.rows[0] as TestimonialDTO);
    } catch (error: any) {
      logger.log(`Error fetching testimonial with id ${id} from locale ${locale}:`, error);
      throw new Error(`Failed to fetch testimonial: ${error.message}`);
    }
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id'>, locale: string): Promise<Testimonial> {
    try {
      const tableName = `testimonials_${locale}`;
      const id = testimonial.author.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      const query = `
        INSERT INTO "${tableName}" (id, author, role, company, quote, image, image_alt, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        id,
        testimonial.author,
        testimonial.role,
        testimonial.company,
        testimonial.quote,
        testimonial.image,
        testimonial.image_alt,
        new Date().toISOString(),
        new Date().toISOString()
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
        id,
        ...testimonial,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error: any) {
      logger.log(`Error creating testimonial in locale ${locale}:`, error);
      throw new Error(`Failed to create testimonial: ${error.message}`);
    }
  }

  async updateTestimonial(id: string, testimonial: Partial<Testimonial>, locale: string): Promise<Testimonial | null> {
    try {
      const tableName = `testimonials_${locale}`;
      const dto = TestimonialMapper.toPersistence(testimonial);

      // Construct the SET part of the SQL query dynamically based on provided fields
      const updates: string[] = [];
      const params: any[] = [];

      // Use the mapped DTO values instead of the original testimonial
      for (const key in dto) {
        if (dto.hasOwnProperty(key) && key !== 'id') {
          updates.push(`"${key}" = ?`);
          params.push(dto[key as keyof TestimonialDTO]); // Use dto values instead of testimonial values
        }
      }

      if (updates.length === 0) {
        return this.getTestimonialById(id, locale);
      }

      // Add updated_at to the updates
      updates.push(`"updated_at" = ?`);
      params.push(new Date().toISOString());
      
      // Add the id for the WHERE clause
      params.push(id);

      const query = `
        UPDATE "${tableName}"
        SET ${updates.join(', ')}
        WHERE id = ?
      `;

      console.log('Update query:', query);
      console.log('Update params:', params);

      await new Promise<void>((resolve, reject) => {
        this.db.run(query, params, function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      return this.getTestimonialById(id, locale);
    } catch (error: any) {
      logger.log(`Error updating testimonial with id ${id} in locale ${locale}:`, error);
      throw new Error(`Failed to update testimonial: ${error.message}`);
    }
  }

  async deleteTestimonial(id: string, locale: string): Promise<boolean> {
    try {
      const tableName = `testimonials_${locale}`;
      const query = `DELETE FROM "${tableName}" WHERE id = ?`;

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
      logger.log(`Error deleting testimonial with id ${id} in locale ${locale}:`, error);
      throw new Error(`Failed to delete testimonial: ${error.message}`);
    }
  }

  async list(locale?: string): Promise<Testimonial[]> {
    const tableName = locale ? `testimonials_${locale}` : this.tableName;
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM "${tableName}";
      `;

      this.db.all(query, [], (err, rows: any[]) => {
        if (err) {
          logger.log(`Error listing entities from table "${tableName}":`, err);
          reject(new Error(`Database error listing entities from table "${tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        const testimonials = rows.map(TestimonialMapper.toDomain);
        resolve(testimonials || []);
      });
    });
  }
}

export const testimonialRepositoryLocal = new TestimonialRepositoryLocal();