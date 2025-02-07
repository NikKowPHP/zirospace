import { SqlLiteAdapter} from '@/lib/repositories/adapters/sqllite.adapter';
import { CaseStudySlider } from '@/domain/models/case-study-slider.model';
import { ICaseStudySliderRepository } from '../interfaces/caseStudySliderRepository.interface';
import { Database } from 'sqlite3';
import { getDatabaseFilePath } from '@/lib/config/database.config';
import { Locale } from '@/i18n';

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

  async createCaseStudySlider(caseStudySlider: Omit<CaseStudySlider, 'id'>): Promise<CaseStudySlider> {
    try {
      const tableName = this.tableName;
      const id = `slider-${Date.now()}`; // Generate a simple ID
      const query = `
        INSERT INTO "${tableName}" (id, theme, created_at, updated_at)
        VALUES (?, ?, ?, ?)
      `;
      const params = [
        id,
        caseStudySlider.theme,
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

      // Create the images
      await Promise.all(caseStudySlider.images.map(async (image) => {
        const imageQuery = `
          INSERT INTO case_study_slider_images (id, slider_id, image, alt)
          VALUES (?, ?, ?, ?)
        `;
        const imageParams = [
          image.id,
          id,
          image.image,
          image.alt
        ];

        await new Promise<void>((resolve, reject) => {
          db.run(imageQuery, imageParams, function (err: Error | null) {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        });
      }));

      return {
        id,
        ...caseStudySlider,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error: any) {
      console.error(`Error creating case study slider:`, error);
      throw new Error(`Failed to create case study slider: ${error.message}`);
    }
  }

  async updateCaseStudySlider(id: string, caseStudySlider: Partial<CaseStudySlider>): Promise<CaseStudySlider | null> {
    try {
      const tableName = this.tableName;
      const updates: string[] = [];
      const params: any[] = [];

      console.log('id in update ', id)

      for (const key in caseStudySlider) {
        if (caseStudySlider.hasOwnProperty(key) && key !== 'id' && key !== 'images' && key !== 'createdAt' && key !== 'updatedAt') {
          updates.push(`${key} = ?`);
          params.push((caseStudySlider as any)[key]);
        }
      }

      if (updates.length === 0) {
        return this.getCaseStudySliderById(id);
      }

      params.push(id);

      const query = `
        UPDATE "${tableName}"
        SET ${updates.join(', ')}, updated_at = ?
        WHERE id = ?
      `;
      console.log('query in update ', query)

      params.unshift(new Date().toISOString());
      updates.push(`updated_at = ?`);
      console.log('params in update ', params)
      await new Promise<void>((resolve, reject) => {
        this.db.run(query, params, function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      // Update the images
      await Promise.all((caseStudySlider.images || []).map(async (image) => {
        const imageQuery = `
          UPDATE case_study_slider_images
          SET image = ?, alt = ?
          WHERE id = ?
        `;
        const imageParams = [
          image.image,
          image.alt,
          image.id
        ];

        await new Promise<void>((resolve, reject) => {
          db.run(imageQuery, imageParams, function (err: Error | null) {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        });
      }));

      return this.getCaseStudySliderById(id);
    } catch (error: any) {
      console.error(`Error updating case study slider with id ${id}:`, error);
      throw new Error(`Failed to update case study slider: ${error.message}`);
    }
  }

  async deleteCaseStudySlider(id: string): Promise<void> {
    try {
      const tableName = this.tableName;
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
    } catch (error: any) {
      console.error(`Error deleting case study slider with id ${id}:`, error);
      throw new Error(`Failed to delete case study slider: ${error.message}`);
    }
  }

  async getCaseStudySliderById(id: string): Promise<CaseStudySlider | null> {
    try {
      const tableName = this.tableName;
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

      const slider = result.rows[0] as CaseStudySlider;
      const images = await this.getImagesForSlider(id);
      return {
        ...slider,
        images: images,
      };
    } catch (error: any) {
      console.error(`Error fetching case study slider with id ${id}:`, error);
      throw new Error(`Failed to fetch case study slider: ${error.message}`);
    }
  }

  async list(): Promise<CaseStudySlider[]> {
    const tableName = this.tableName;
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
        const caseStudySliders = rows.map((row: any) => ({
          id: row.id,
          theme: row.theme,
          images: [], // Fetch images separately if needed
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        }));
        console.log('case study sliders in repository ', caseStudySliders)
        resolve(caseStudySliders || []);
      });
    });
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