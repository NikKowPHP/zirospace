import { Banner } from '@/domain/models/banner.model'
import { BannerDTO } from '@/infrastructure/dto/banner.dto'
import { BannerMapper } from '@/infrastructure/mappers/banner.mapper'
import { IBannerRepository } from '@/lib/interfaces/bannersRepository.interface'
import { SqlLiteAdapter } from '@/lib/repositories/adapters/sqllite.adapter'
import { Database } from 'sqlite3'
import { getDatabaseFilePath } from '@/lib/config/database.config'
import logger from '@/lib/logger'

const dbPath = getDatabaseFilePath()
const db = new Database(dbPath)

export class BannerRepositoryLocal extends SqlLiteAdapter<Banner, string> implements IBannerRepository {
  constructor() {
    super("banners", db)
  }

  getActiveBanner = async (locale: string): Promise<Banner | null> => {
    const tableName = this.getTableName(locale);
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM "${tableName}"
        WHERE is_active = 1
        AND (start_date IS NULL OR start_date <= CURRENT_TIMESTAMP)
        AND (end_date IS NULL OR end_date >= CURRENT_TIMESTAMP)
        ORDER BY created_at DESC
        LIMIT 1;
      `;
      this.db.get(query, [], (err, row) => {
        if (err) {
          reject(err)
          return
        }
        resolve(row ? BannerMapper.toDomain(row as BannerDTO) : null)
      })
    })
  }

  getBanners = async (locale: string): Promise<Banner[]> => {
    const result = await this.list(locale)
    return result
  }
  private getTableName(locale: string | undefined): string {
    return locale ? `zirospace_banners_${locale}` : this.tableName
  }

  async list(locale?: string): Promise<Banner[]> {
    const tableName = this.getTableName(locale)
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM "${tableName}";
      `
      this.db.all(query, [], (err, rows: any[]) => {
        if (err) {
          logger.log(`Error listing entities from table "${tableName}":`, err)
          reject(new Error(`Database error listing entities from table "${tableName}": ${err.message || 'Unknown error'}`))
          return
        }
        const banners = rows.map(BannerMapper.toDomain)
        resolve(banners || [])
      })
    })
  }

  getBannerById = async (id: string, locale: string): Promise<Banner | null> => {
    // Define the table name before the try/catch so it is available in the catch block.
    const tableName = this.getTableName(locale)
    try {
      const query = `
        SELECT * FROM "${tableName}"
        WHERE id = ?;
      `
      const result = await new Promise<any>((resolve, reject) => {
        this.db.get(query, [id], (err, row) => {
          if (err) {
            reject(err)
            return
          }
          resolve({ rows: [row] })
        })
      })
      if (!result.rows[0]) {
        return null
      }
      return BannerMapper.toDomain(result.rows[0] as BannerDTO)
    } catch (error: unknown) {
      logger.log(`Error reading banner from table "${tableName}" with id ${id}:`, error)
      throw new Error(`Database error reading banner from table "${tableName}": ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  createBanner = async (banner: Partial<BannerDTO>, locale: string): Promise<Banner> => {
    const tableName = this.getTableName(locale)

    return new Promise((resolve, reject) => {
      const columns = Object.keys(banner)
        .filter(key => banner[key as keyof BannerDTO] !== undefined)
        .map(key => `"${key}"`)
        .join(', ')
      const placeholders = Object.keys(banner)
        .filter(key => banner[key as keyof BannerDTO] !== undefined)
        .map(() => '?')
        .join(', ')
      const values = Object.values(banner).filter(value => value !== undefined)

      const query = `
        INSERT INTO "${tableName}" (${columns})
        VALUES (${placeholders})
      `

      this.db.run(query, values, function (err) {
        if (err) {
          logger.log(`Error creating banner in table "${tableName}":`, err)
          reject(new Error(`Database error creating banner in table "${tableName}": ${err.message || 'Unknown error'}`))
          return
        }
        // After insertion, retrieve the created banner using its id.
        const id = banner.id
        const selectQuery = `SELECT * FROM "${tableName}" WHERE id = ?`
        db.get(selectQuery, [id], (err, row: any) => {
          if (err) {
            logger.log(`Error retrieving created banner from table "${tableName}":`, err)
            reject(new Error(`Database error retrieving created banner from table "${tableName}": ${err.message || 'Unknown error'}`))
            return
          }
          if (!row) {
            reject(new Error(`Failed to retrieve created banner from table "${tableName}"`))
            return
          }
          const createdBanner = BannerMapper.toDomain(row as BannerDTO)
          resolve(createdBanner)
        })
      })
    })
  }

  async updateBanner(id: string, banner: Partial<BannerDTO>, locale: string): Promise<Banner> {
    const tableName = this.getTableName(locale)
    const existingBanner = await this.getBannerById(id, locale);
    if (!existingBanner) {
      throw new Error('Banner not found');
    }
    banner.id = id
    return new Promise((resolve, reject) => {
      const updates = Object.keys(banner)
        .filter(key => banner[key as keyof BannerDTO] !== undefined)
        .map(key => `"${key}" = ?`)
        .join(', ')
      const values = Object.values(banner).filter(value => value !== undefined)
      const query = `
        UPDATE "${tableName}"
        SET ${updates}
        WHERE id = ?
      `


      this.db.run(query, [...values, id], function (err) {
        if (err) {
          logger.log(`Error updating banner in table "${tableName}":`, err)
          reject(new Error(`Database error updating banner in table "${tableName}": ${err.message || 'Unknown error'}`))
          return
        }
        const selectQuery = `SELECT * FROM "${tableName}" WHERE id = ?`
        db.get(selectQuery, [id], (err, row: any) => {
          if (err) {
            logger.log(`Error retrieving updated banner from table "${tableName}":`, err)
            reject(new Error(`Database error retrieving updated banner from table "${tableName}": ${err.message || 'Unknown error'}`))
            return
          }
          if (!row) {
            reject(new Error(`Failed to retrieve updated banner from table "${tableName}"`))
            return
          }
          const updatedBanner = BannerMapper.toDomain(row as BannerDTO)
          resolve(updatedBanner)
        })
      })
    })
  }

  deleteBanner = async (id: string, locale: string): Promise<void> => {
    const tableName = this.getTableName(locale)
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM "${tableName}"
        WHERE id = ?
      `
      this.db.run(query, [id], function (err) {
        if (err) {
          logger.log(`Error deleting banner from table "${tableName}" with id ${id}:`, err)
          reject(new Error(`Database error deleting banner from table "${tableName}": ${err.message || 'Unknown error'}`))
          return
        }
        resolve()
      })
    })
  }
}

// export singleton
export const bannerRepositoryLocal = new BannerRepositoryLocal()