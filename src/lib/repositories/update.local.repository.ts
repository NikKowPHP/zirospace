import { IUpdatesRepository } from "@/lib/interfaces/updatesRepository.interface";
import { Update } from "@/domain/models/update.model";
import { SqlLiteAdapter } from "@/lib/repositories/adapters/sqllite.adapter";
import { UpdateMapper } from "@/infrastructure/mappers/update.mapper";
import sqlite3 from 'sqlite3';

export class UpdateRepositoryLocal implements IUpdatesRepository {
  private db: SqlLiteAdapter<Update, string>;

  constructor() {
    this.db = new SqlLiteAdapter<Update, string>('updates_en', new sqlite3.Database('./src/lib/data/sql/sqlite.db'));
  }

  async getUpdates(): Promise<Update[]> {
      const updatesDTO = await this.db.list();
      return updatesDTO.map((updateDTO) => UpdateMapper.toDomain(updateDTO));
    }
  
    async getUpdateBySlug(slug: string): Promise<Update | null> {
      const updateDTO = await this.db.read(slug);
      if (!updateDTO) {
        return null;
      }
      return UpdateMapper.toDomain(updateDTO);
    }
  
   async getUpdateById(id: string): Promise<Update | null> {
      const updateDTO = await this.db.read(id);
      if (!updateDTO) {
        return null;
      }
      return UpdateMapper.toDomain(updateDTO);
    }

  async createUpdate(update: Update): Promise<Update> {
    const updateDTO = UpdateMapper.toPersistence(update);
    // @ts-ignore
    await this.db.create(updateDTO);
    return update; // Assuming the create method returns the created object
  }

  async updateUpdate(id: string, update: Update): Promise<Update> {
    const updateDTO = UpdateMapper.toPersistence(update);
     // @ts-ignore
    await this.db.update(id, updateDTO);
    return update; // Assuming the update method returns the updated object
  }

  async deleteUpdate(id: string): Promise<void> {
    await this.db.delete(id);
  }
}