import { Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/case-study.model'
import { CaseStudyDTO } from '@/infrastructure/dto/case-study.dto'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import { ICaseStudyRepository } from '../interfaces/caseStudyRepository.interface';
import { SqlLiteAdapter } from '@/lib/repositories/adapters/sqllite.adapter';
import { Database } from 'sqlite3';

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
// });
const db = new Database(process.env.DATABASE_URL || 'sqlite.db');

export class CaseStudyRepositoryLocal extends SqlLiteAdapter<CaseStudy, string> implements ICaseStudyRepository {
  constructor() {
    super("case_studies", db);
  }

  getCaseStudies = async (locale: Locale): Promise<CaseStudy[]> => {
    // const caseStudyDBRepository = new PostgresDBRepository<CaseStudy, string>(`case_studies_${locale}`, pool);
    // const result = await caseStudyDBRepository.list()
    const result = await this.list()
    console.log(result)
    return result
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

// export singleton
export const caseStudyRepositoryLocal = new CaseStudyRepositoryLocal();