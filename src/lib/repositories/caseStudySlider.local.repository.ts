import { SqlLiteAdapter} from '@/lib/repositories/adapters/sqllite.adapter';
import { CaseStudySlider } from '@/domain/models/case-study-slider.model';
import { ICaseStudySliderRepository } from '../interfaces/caseStudySliderRepository.interface';
import { Database } from 'sqlite3';
import { getDatabaseFilePath } from '@/lib/config/database.config';

const dbPath = getDatabaseFilePath();
const db = new Database(dbPath);

export class CaseStudySliderRepositoryLocal extends SqlLiteAdapter<CaseStudySlider, string> implements ICaseStudySliderRepository{
  constructor() {
    super("case_study_sliders", db);
  }

  getCaseStudiesSliders = async (): Promise<CaseStudySlider[]> => {
    const sliders = await this.list()
    console.log('sliders in repository ', sliders)

    return Promise.all(sliders.map(async (slider) => {
      const images = await this.getImagesForSlider(slider.id);
      return {
        ...slider,
        images: images,
      };
    }));
  }

  private async getImagesForSlider(sliderId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM case_study_slider_images WHERE slider_id = ?`;
      this.db.all(query, [sliderId], (err, rows: any[]) => {
        if (err) {
          console.error(`Error fetching images for slider ${sliderId}:`, err);
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }
}

// export singleton
export const caseStudySliderRepositoryLocal = new CaseStudySliderRepositoryLocal();