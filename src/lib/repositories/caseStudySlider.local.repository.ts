import { SqlLiteAdapter} from '@/lib/repositories/adapters/sqllite.adapter';
import { CaseStudySlider } from '@/domain/models/case-study-slider.model';
import { ICaseStudySliderRepository } from '../interfaces/caseStudySliderRepository.interface';
import { Database } from 'sqlite3';
import { getDatabaseFilePath } from '@/lib/config/database.config';

const dbPath = getDatabaseFilePath();
const db = new Database(dbPath);

export class CaseStudySliderRepositoryLocal extends SqlLiteAdapter<CaseStudySlider, string> implements ICaseStudySliderRepository{
  constructor() {
    super("case_studies_sliders", db);
  }

  getCaseStudiesSliders = async (): Promise<CaseStudySlider[]> => {
    const result = await this.list()
    console.log(result)
    return result
  }

  
  
}

// export singleton
export const caseStudySliderRepositoryLocal = new CaseStudySliderRepositoryLocal();