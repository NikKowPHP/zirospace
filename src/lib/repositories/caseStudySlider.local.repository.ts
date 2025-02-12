import { SqlLiteAdapter} from '@/lib/repositories/adapters/sqllite.adapter';
import { CaseStudySlider } from '@/domain/models/case-study-slider.model';
import { ICaseStudySliderRepository } from '../interfaces/caseStudySliderRepository.interface';
import { Database } from 'sqlite3';
import { getDatabaseFilePath } from '@/lib/config/database.config';
import logger from '@/lib/logger'
const dbPath = getDatabaseFilePath();
const db = new Database(dbPath);

export class CaseStudySliderRepositoryLocal extends SqlLiteAdapter<CaseStudySlider, string> implements ICaseStudySliderRepository{
  constructor() {
    super("case_study_sliders", db);
  }

  getCaseStudiesSliders = async (): Promise<CaseStudySlider[]> => {
    const sliders = await this.list()

    return Promise.all(sliders.map(async (slider) => {
      const images = await this.getImagesForSlider(slider.id);
      return {
        ...slider,
        images: images,
      };
    }));
  }

  async createCaseStudySlider(caseStudySlider: Omit<CaseStudySlider, 'id'>): Promise<CaseStudySlider> {
    const id = `slider-${Date.now()}`; // Generate a simple ID
    try {
      const tableName = this.tableName;
      const query = `
        INSERT INTO "${tableName}" (id, theme, created_at, updated_at)
        VALUES (?, ?, ?, ?)
      `;
      const params = [
        id,
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
        ...caseStudySlider,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error: any) {
      logger.log(`Error creating case study slider:`, error);
      throw new Error(`Failed to create case study slider: ${error.message}`);
    }
  }

  async updateCaseStudySlider(id: string, caseStudySlider: Partial<CaseStudySlider>): Promise<CaseStudySlider | null> {
    try {
      const deleteImagesQuery = `
        DELETE FROM case_study_slider_images
        WHERE slider_id = ?
      `;
      
      await new Promise<void>((resolve, reject) => {
        this.db.run(deleteImagesQuery, [id], function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
  
      if (caseStudySlider.images && caseStudySlider.images.length > 0) {
        const insertImageQuery = `
          INSERT INTO case_study_slider_images (id, slider_id, image, alt)
          VALUES (?, ?, ?, ?)
        `;
  
        await Promise.all(caseStudySlider.images.map(async (image) => {
          const imageParams = [
            image.id,
            id,
            image.image,
            image.alt
          ];
  
          return new Promise<void>((resolve, reject) => {
            this.db.run(insertImageQuery, imageParams, function (err: Error | null) {
              if (err) {
                reject(err);
                return;
              }
              resolve();
            });
          });
        }));
      }
  
      // Update the slider's updated_at timestamp
      const updateSliderQuery = `
        UPDATE "${this.tableName}"
        SET updated_at = ?
        WHERE id = ?
      `;
  
      await new Promise<void>((resolve, reject) => {
        this.db.run(updateSliderQuery, [new Date().toISOString(), id], function (err: Error | null) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
  
      return this.getCaseStudySliderById(id);
    } catch (error: any) {
      logger.log(`Error updating case study slider with id ${id}:`, error);
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
      logger.log(`Error deleting case study slider with id ${id}:`, error);
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
      logger.log(`Error fetching case study slider with id ${id}:`, error);
      throw new Error(`Failed to fetch case study slider: ${error.message}`);
    }
  }

  async list(): Promise<CaseStudySlider[]> {
    const tableName = this.tableName;
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
        const caseStudySliders = rows.map((row: any) => ({
          id: row.id,
          theme: row.theme,
          images: [], // Fetch images separately if needed
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        }));
        resolve(caseStudySliders || []);
      });
    });
  }

  private async getImagesForSlider(sliderId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM case_study_slider_images WHERE slider_id = ?`;
      this.db.all(query, [sliderId], (err, rows: any[]) => {
        if (err) {
          logger.log(`Error fetching images for slider ${sliderId}:`, err);
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