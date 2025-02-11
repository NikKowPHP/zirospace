import { Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/case-study.model'
import { CaseStudyDTO } from '@/infrastructure/dto/case-study.dto'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import { ICaseStudyRepository } from '../interfaces/caseStudyRepository.interface';
import { SqlLiteAdapter } from '@/lib/repositories/adapters/sqllite.adapter';
import { Database } from 'sqlite3';
import { getDatabaseFilePath } from '@/lib/config/database.config';

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

  createCaseStudy = async (caseStudy: CaseStudy, locale: Locale): Promise<CaseStudy> => {
    const tableName = `case_studies_${locale}`;
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO "${tableName}" (
          slug, title, subtitle, description, tags, images,
          ctaText, ctaTextName, ctaUrl, createdAt, updatedAt,
          color, backgroundColor, theme
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *;
      `;

      this.db.run(
        query,
        [
          caseStudy.slug, caseStudy.title, caseStudy.subtitle,
          caseStudy.description, JSON.stringify(caseStudy.tags), JSON.stringify(caseStudy.images),
          caseStudy.ctaText, caseStudy.ctaTextName, caseStudy.ctaUrl,
          caseStudy.createdAt ? caseStudy.createdAt.toISOString() : null, 
          caseStudy.updatedAt ? caseStudy.updatedAt.toISOString() : null,
          caseStudy.color, caseStudy.backgroundColor, caseStudy.theme
        ],
        function (err: Error | null) {
          if (err) {
            console.error(`Error creating entity in table "${tableName}":`, err);
            reject(new Error(`Database error creating entity in table "${tableName}": ${err.message || 'Unknown error'}`));
            return;
          }

          db.get(`SELECT * FROM "${tableName}" WHERE id = ?`, [this.lastID], (err, row: any) => {
            if (err) {
              console.error(`Error retrieving created entity from table "${tableName}":`, err);
              reject(new Error(`Database error retrieving created entity from table "${tableName}": ${err.message || 'Unknown error'}`));
              return;
            }
            const createdCaseStudy = CaseStudyMapper.toDomain(row);
            resolve(createdCaseStudy);
          });
        }
      );
    });
  }

  updateCaseStudy = async (id: string, caseStudy: CaseStudy, locale: Locale): Promise<CaseStudy> => {
    const tableName = `case_studies_${locale}`;
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE "${tableName}" SET
          slug = ?, title = ?, subtitle = ?, description = ?,
          tags = ?, images = ?, ctaText = ?, ctaTextName = ?,
          ctaUrl = ?, createdAt = ?, updatedAt = ?, color = ?,
          backgroundColor = ?, theme = ?
        WHERE id = ?
        RETURNING *;
      `;

      this.db.run(
        query,
        [
          caseStudy.slug, caseStudy.title, caseStudy.subtitle,
          caseStudy.description, JSON.stringify(caseStudy.tags), JSON.stringify(caseStudy.images),
          caseStudy.ctaText, caseStudy.ctaTextName, caseStudy.ctaUrl,
          caseStudy.createdAt ? caseStudy.createdAt.toISOString() : null,
          caseStudy.updatedAt ? caseStudy.updatedAt.toISOString() : null,
          caseStudy.color, caseStudy.backgroundColor, caseStudy.theme,
          id
        ],
        function (err: Error | null) {
          if (err) {
            console.error(`Error updating entity in table "${tableName}":`, err);
            reject(new Error(`Database error updating entity in table "${tableName}": ${err.message || 'Unknown error'}`));
            return;
          }

          db.get(`SELECT * FROM "${tableName}" WHERE id = ?`, [id], (err, row: any) => {
            if (err) {
              console.error(`Error retrieving updated entity from table "${tableName}":`, err);
              reject(new Error(`Database error retrieving updated entity from table "${tableName}": ${err.message || 'Unknown error'}`));
              return;
            }
            const updatedCaseStudy = CaseStudyMapper.toDomain(row);
            resolve(updatedCaseStudy);
          });
        }
      );
    });
  }

  deleteCaseStudy = async (id: string, locale: Locale): Promise<void> => {
    const tableName = `case_studies_${locale}`;
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM "${tableName}"
        WHERE id = ?;
      `;

      this.db.run(query, [id], (err: Error | null) => {
        if (err) {
          console.error(`Error deleting entity from table "${tableName}":`, err);
          reject(new Error(`Database error deleting entity from table "${tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        resolve();
      });
    });
  }
}

// export singleton
export const caseStudyRepositoryLocal = new CaseStudyRepositoryLocal();