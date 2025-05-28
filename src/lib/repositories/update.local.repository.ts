import { IUpdatesRepository } from '@/lib/interfaces/updatesRepository.interface'
import sqlite3 from 'sqlite3'
import { Update } from '@/domain/models/update.model'
import { SqlLiteAdapter } from '@/lib/repositories/adapters/sqllite.adapter'
import { UpdateMapper } from '@/infrastructure/mappers/update.mapper'
import logger from '@/lib/logger'
export class UpdateRepositoryLocal implements IUpdatesRepository {
  private db: SqlLiteAdapter<Update, string>

  constructor(locale: string) {
    this.db = new SqlLiteAdapter<Update, string>(
      `updates_${locale}`,
      new sqlite3.Database('./src/lib/data/sql/sqlite.db')
    )
  }

  async getUpdates(): Promise<Update[]> {
    const updatesDTO = await this.db.list()
    return updatesDTO.map((updateDTO) => UpdateMapper.toDomain(updateDTO))
  }

  async getUpdateBySlug(slug: string): Promise<Update | null> {
    const updatesDTO = await this.db.list()
    const updateDTO = updatesDTO.find((u) => u.slug === slug)
    if (!updateDTO) {
      return null
    }
    return UpdateMapper.toDomain(updateDTO)
  }

  async getUpdateById(id: string): Promise<Update | null> {
    const updatesDTO = await this.db.list()
    const updateDTO = updatesDTO.find((u) => u.id === id)
    if (!updateDTO) {
      return null
    }
    return UpdateMapper.toDomain(updateDTO)
  }

  async createUpdate(update: Update): Promise<Update> {
    const updateDTO = UpdateMapper.toPersistence(update)
    // @ts-ignore
    await this.db.create(updateDTO)
    return update
  }

  async updateUpdate(id: string, update: Update): Promise<Update> {
    const updateDTO = UpdateMapper.toPersistence(update)
    // @ts-ignore
    await this.db.update(id, updateDTO)
    return update
  }

  async deleteUpdate(id: string): Promise<void> {
    await this.db.delete(id)
  }
}
