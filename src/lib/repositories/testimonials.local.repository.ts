import { Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/case-study.model'
import { CaseStudyDTO } from '@/infrastructure/dto/case-study.dto'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import { ICaseStudyRepository } from '../interfaces/caseStudyRepository.interface';
import { SqlLiteAdapter } from '@/lib/repositories/adapters/sqllite.adapter';
import { Database } from 'sqlite3';
import { getDatabaseFilePath } from '@/lib/config/database.config';
import { ITestimonialRepository } from '../interfaces/testimonials.interface';
import { Testimonial } from '@/domain/models/testimonial.model';
import { TestimonialDTO } from '@/infrastructure/dto/testimonial.dto';
import { TestimonialMapper } from '@/infrastructure/mappers/testimonial.mapper';

const dbPath = getDatabaseFilePath();
const db = new Database(dbPath);

export class CaseStudyRepositoryLocal extends SqlLiteAdapter<CaseStudy, string> implements ICaseStudyRepository {
  constructor() {
    super("case_studies", db);
  }

  getCaseStudies = async (locale: Locale): Promise<CaseStudy[]> => {
    const result = await this.list(locale)
    console.log(result)
    return result
  }

  async list(locale?: Locale): Promise<CaseStudy[]> {
    const tableName = locale ? `case_studies_${locale}` : this.tableName;
    console.log('table name in list ', tableName)
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM "${tableName}";
      `;

      this.db.all(query, [], (err, rows: any[]) => {
        if (err) {
          console.error(`Error listing entities from table "${tableName}":`, err);
          reject(new Error(`Database error listing entities from table "${tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        const caseStudies = rows.map(CaseStudyMapper.toDomain);
        console.log('case studies in repository ', caseStudies)
        resolve(caseStudies || []);
      });
    });
  }

  getCaseStudyBySlug = async (slug: string, locale: Locale): Promise<CaseStudy | null> => {
    // const client = await pool.connect();
    try {
      const tableName = `case_studies_${locale}`;
      const query = `
        SELECT * FROM "${tableName}"
        WHERE slug = ?;
      `;
      // const result = await client.query(query, [slug]);
      const result = await new Promise<any>((resolve, reject) => {
        this.db.get(query, [slug], (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({ rows: [row] });
        });
      });
      console.log(result)
      if (result.rows.length === 0) {
        return null; // Entity not found
      }
      return CaseStudyMapper.toDomain(result.rows[0] as CaseStudyDTO);
    } catch (error: unknown) {
      console.error(`Error reading entity from table "case_studies_${locale}" with slug ${slug}:`, error);
      throw new Error(`Database error reading entity from table "case_studies_${locale}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export class TestimonialRepositoryLocal extends SqlLiteAdapter<Testimonial, string> implements ITestimonialRepository {
  constructor() {
    super("testimonials", db);
  }

  async getTestimonials(locale: string): Promise<Testimonial[]> {
    const result = await this.list(locale)
    console.log(result)
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
      console.error(`Error fetching testimonial with id ${id} from locale ${locale}:`, error);
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
      console.error(`Error creating testimonial in locale ${locale}:`, error);
      throw new Error(`Failed to create testimonial: ${error.message}`);
    }
  }

  async updateTestimonial(id: string, testimonial: Partial<Testimonial>, locale: string): Promise<Testimonial | null> {
    try {
      const tableName = `testimonials_${locale}`;
      // Construct the SET part of the SQL query dynamically based on provided fields
      const updates: string[] = [];
      const params: any[] = [];

      for (const key in testimonial) {
        if (testimonial.hasOwnProperty(key) && key !== 'id') {
          updates.push(`${key} = ?`);
          params.push((testimonial as any)[key]);
        }
      }

      if (updates.length === 0) {
        return this.getTestimonialById(id, locale);
      }

      params.push(id); // Add the id to the parameters for the WHERE clause

      const query = `
        UPDATE "${tableName}"
        SET ${updates.join(', ')}, updated_at = ?
        WHERE id = ?
      `;

      params.unshift(new Date().toISOString());
      updates.push(`updated_at = ?`);

      await new Promise<void>((resolve, reject) => {
        this.db.run(query, params, function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      return this.getTestimonialById(id, locale); // Fetch and return the updated testimonial
    } catch (error: any) {
      console.error(`Error updating testimonial with id ${id} in locale ${locale}:`, error);
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
      console.error(`Error deleting testimonial with id ${id} in locale ${locale}:`, error);
      throw new Error(`Failed to delete testimonial: ${error.message}`);
    }
  }

  async list(locale?: string): Promise<Testimonial[]> {
    const tableName = locale ? `testimonials_${locale}` : this.tableName;
    console.log('table name in list ', tableName)
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM "${tableName}";
      `;

      this.db.all(query, [], (err, rows: any[]) => {
        if (err) {
          console.error(`Error listing entities from table "${tableName}":`, err);
          reject(new Error(`Database error listing entities from table "${tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        const testimonials = rows.map(TestimonialMapper.toDomain);
        console.log('testimonials in repository ', testimonials)
        resolve(testimonials || []);
      });
    });
  }
}

// export singleton
export const caseStudyRepositoryLocal = new CaseStudyRepositoryLocal();
export const testimonialRepositoryLocal = new TestimonialRepositoryLocal();