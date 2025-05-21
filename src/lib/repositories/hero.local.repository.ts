import { Database } from 'sqlite3';
import { getDatabaseFilePath } from '@/lib/config/database.config';
import logger from '@/lib/logger';
import { HeroModel } from '@/domain/models/models';
import { IHeroRepository } from './hero.repository';

const dbPath = getDatabaseFilePath();
const db = new Database(dbPath);

const FIXED_HERO_ID_EN = 'hero_en_1';
const FIXED_HERO_ID_PL = 'hero_pl_1';

export class HeroRepositoryLocal implements IHeroRepository {
  private db: Database;

  constructor() {
    this.db = db;
  }

  private getTableName(locale: string): string {
    return `zirospace_hero_${locale}`;
  }

  private getFixedIdForLocale(locale: string): string {
    return locale === 'pl' ? FIXED_HERO_ID_PL : FIXED_HERO_ID_EN;
  }
async getHero(locale: string): Promise<HeroModel | null> {
    const tableName = this.getTableName(locale);
    const fixedId = this.getFixedIdForLocale(locale);
    const query = `SELECT * FROM "${tableName}" WHERE id = ? LIMIT 1;`;

    return new Promise((resolve, reject) => {
      this.db.get(query, [fixedId], (err, row: HeroModel | undefined) => {
        if (err) {
          logger.error(`Error fetching hero from ${tableName}:`, err);
          return reject(err);
        }
        logger.log(`Hero data from local SQLite table ${tableName}:`, row);
        resolve(row || null);
      });
    });
  }
async updateHero(heroData: Partial<HeroModel>, locale: string): Promise<HeroModel | null> {
    const tableName = this.getTableName(locale);
    const fixedId = this.getFixedIdForLocale(locale);

    const updates = Object.keys(heroData)
      .filter(key => key !== 'id' && (heroData as Partial<HeroModel>)[key as keyof HeroModel] !== undefined) // Exclude ID from updates
      .map(key => `"${key}" = ?`)
      .join(', ');

    if (!updates) {
      logger.log('No fields to update for hero section.');
      return this.getHero(locale); // No actual update, return current data
    }

    const values = Object.entries(heroData)
      .filter(([key, value]) => key !== 'id' && value !== undefined)
      .map(([, value]) => value);

    // Ensure updated_at is always set
    const finalUpdates = `${updates}, "updated_at" = ?`;
    const finalValues = [...values, new Date().toISOString()];


    const query = `
      UPDATE "${tableName}"
      SET ${finalUpdates}
      WHERE id = ?;
    `;

    return new Promise((resolve, reject) => {
      this.db.run(query, [...finalValues, fixedId], (err) => {
        if (err) {
          logger.error(`Error updating hero in ${tableName}:`, err);
          return reject(err);
        }
        // After update, fetch the updated record
        this.getHero(locale).then(resolve).catch(reject);
      });
    });
  }
  
}

export const heroRepositoryLocal = new HeroRepositoryLocal();