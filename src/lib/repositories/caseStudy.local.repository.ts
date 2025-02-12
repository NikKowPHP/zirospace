import { Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/case-study.model'
import { CaseStudyDTO } from '@/infrastructure/dto/case-study.dto'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import { ICaseStudyRepository } from '../interfaces/caseStudyRepository.interface';
import { SqlLiteAdapter } from '@/lib/repositories/adapters/sqllite.adapter';
import { Database } from 'sqlite3';
import { getDatabaseFilePath } from '@/lib/config/database.config';
import logger from '@/lib/logger'
const dbPath = getDatabaseFilePath();
const db = new Database(dbPath);

export class CaseStudyRepositoryLocal extends SqlLiteAdapter<CaseStudy, string> implements ICaseStudyRepository {
  constructor() {
    super("case_studies", db);
  }

  getCaseStudies = async (locale: Locale): Promise<CaseStudy[]> => {
    const result = await this.list(locale)
    return result
  }

  async list(locale?: Locale): Promise<CaseStudy[]> {
    const tableName = locale ? `case_studies_${locale}` : this.tableName;
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
        const caseStudies = rows.map(CaseStudyMapper.toDomain);
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
      logger.log(`Error reading entity from table "case_studies_${locale}" with slug ${slug}:`, error);
      throw new Error(`Database error reading entity from table "case_studies_${locale}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  createCaseStudy = async (caseStudy: Partial<CaseStudy>, locale: Locale): Promise<CaseStudy> => {
    const tableName = `case_studies_${locale}`;
    const dto = CaseStudyMapper.toPersistence(caseStudy);

    return new Promise((resolve, reject) => {
      const columns = Object.keys(dto)
        .filter(key => dto[key as keyof CaseStudyDTO] !== undefined)
        .map(key => `"${key}"`)
        .join(', ');
      const placeholders = Object.keys(dto)
        .filter(key => dto[key as keyof CaseStudyDTO] !== undefined)
        .map(() => '?')
        .join(', ');
      const values = Object.values(dto).filter(value => value !== undefined);

      const query = `
        INSERT INTO "${tableName}" (${columns})
        VALUES (${placeholders})
      `;

      this.db.run(query, values, function (err) {
        if (err) {
          logger.log(`Error creating entity in table "${tableName}":`, err);
          reject(new Error(`Database error creating entity in table "${tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        // After successful insertion, retrieve the created entity
        const id = caseStudy.id;
        const selectQuery = `SELECT * FROM "${tableName}" WHERE id = ?`;
        db.get(selectQuery, [id], (err, row: any) => {
          if (err) {
            logger.log(`Error retrieving created entity from table "${tableName}":`, err);
            reject(new Error(`Database error retrieving created entity from table "${tableName}": ${err.message || 'Unknown error'}`));
            return;
          }
          if (!row) {
            reject(new Error(`Failed to retrieve created entity from table "${tableName}"`));
            return;
          }
          const createdCaseStudy = CaseStudyMapper.toDomain(row as CaseStudyDTO);
          resolve(createdCaseStudy);
        });
      });
    });
  }

  async updateCaseStudy(id: string, caseStudy: Partial<CaseStudy>, locale: Locale): Promise<CaseStudy> {
    const tableName = `case_studies_${locale}`;
    console.log(' update case study in repository', { caseStudy: caseStudy, id: id });
    const dto = CaseStudyMapper.toPersistence(caseStudy);
    console.log('dto in update', dto);

    return new Promise((resolve, reject) => {
      // Construct the SET part of the SQL query
      const updates = Object.keys(dto)
        .filter(key => dto[key as keyof CaseStudyDTO] !== undefined)
        .map(key => `"${key}" = ?`) // Use ? for values
        .join(', ');

      const values = Object.values(dto).filter(value => value !== undefined);
      console.log(' updates in update with values', updates, values);

      const query = `
        UPDATE "${tableName}"
        SET ${updates}
        WHERE id = ?
      `;

      this.db.run(query, [...values, id], function (err) { // Pass values and id
        if (err) {
          logger.log(`Error updating entity in table "${tableName}":`, err);
          reject(new Error(`Database error updating entity in table "${tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        // After successful update, retrieve the updated entity
        const selectQuery = `SELECT * FROM "${tableName}" WHERE id = ?`;
        db.get(selectQuery, [id], (err, row: any) => {
          if (err) {
            logger.log(`Error retrieving updated entity from table "${tableName}":`, err);
            reject(new Error(`Database error retrieving updated entity from table "${tableName}": ${err.message || 'Unknown error'}`));
            return;
          }
          if (!row) {
            reject(new Error(`Failed to retrieve updated entity from table "${tableName}"`));
            return;
          }
          const createdCaseStudy = CaseStudyMapper.toDomain(row as CaseStudyDTO);
          resolve(createdCaseStudy);
        });
      });
    });
  }
  deleteCaseStudy = async (id: string, locale: Locale): Promise<void> => {
    const tableName = `case_studies_${locale}`;
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM "${tableName}"
        WHERE id = ?
      `;

      console.log('deletion query', query, id)

      this.db.run(query, [id], function (err) {
        if (err) {
          logger.log(`Error deleting entity from table "${tableName}" with id ${id}:`, err);
          reject(new Error(`Database error deleting entity from table "${tableName}": ${err.message || 'Unknown error'}`));
          return;
        }

        // If no error, it means the deletion was successful
        resolve();
      });
    });
  }
}

// export singleton
export const caseStudyRepositoryLocal = new CaseStudyRepositoryLocal();