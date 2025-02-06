import { Pool } from 'pg';
import { Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/case-study.model'
import { CaseStudyDTO } from '@/infrastructure/dto/case-study.dto'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import { PostgresDBRepository } from '@/lib/repositories/db/postgresdb.repository';
import { ICaseStudyRepository } from '../interfaces/caseStudyRepository.interface';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export class CaseStudyRepositoryLocal extends PostgresDBRepository<CaseStudy, string> implements ICaseStudyRepository {
  constructor() {
    super("", pool); // Placeholder table name, we will specify it in methods
  }

  getCaseStudies = async (locale: Locale): Promise<CaseStudy[]> => {
    const caseStudyDBRepository = new PostgresDBRepository<CaseStudy, string>(`case_studies_${locale}`, pool);
    return caseStudyDBRepository.list()
  }

  getCaseStudyBySlug = async (slug: string, locale: Locale): Promise<CaseStudy | null> => {
    const client = await pool.connect();
    try {
      const tableName = `case_studies_${locale}`;
      const query = `
        SELECT * FROM "${tableName}"
        WHERE slug = $1;
      `;
      const result = await client.query(query, [slug]);
      if (result.rows.length === 0) {
        return null; // Entity not found
      }
      return CaseStudyMapper.toDomain(result.rows[0] as CaseStudyDTO);
    } catch (error: unknown) {
      console.error(`Error reading entity from table "case_studies_${locale}" with slug ${slug}:`, error);
      throw new Error(`Database error reading entity from table "case_studies_${locale}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }
}

// export singleton
export const caseStudyRepositoryLocal = new CaseStudyRepositoryLocal();