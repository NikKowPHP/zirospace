import { Pool } from 'pg';
import { Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/case-study.model'
import { CaseStudyDTO } from '@/infrastructure/dto/case-study.dto'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import { PostgresDBRepository } from '@/lib/repositories/db/postgresdb.repository';
import { ICaseStudyRepository } from '../interfaces/caseStudyRepository.interface';
import { logger } from '../utils/logger';
import { CaseStudySlider } from '@/domain/models/case-study-slider.model';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export class CaseStudySliderRepositoryLocal extends PostgresDBRepository<CaseStudySlider, string> implements ICaseStudySliderRepository {
  constructor() {
    super("", pool); // Placeholder table name, we will specify it in methods
  }

  getCaseStudiesSliders = async (): Promise<CaseStudySlider[]> => {
    const caseStudySliderDBRepository = new PostgresDBRepository<CaseStudySlider, string>(`case_studies_sliders`, pool);
    const result = await caseStudySliderDBRepository.list()
    console.log(result)
    return result
  }

  
  
}

// export singleton
export const caseStudySliderRepositoryLocal = new CaseStudySliderRepositoryLocal();