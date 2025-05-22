import { IServiceRepository } from '../interfaces/service.interface';
import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { ServiceMapper } from '../../infrastructure/mappers/service.mapper';
import { getDatabaseFilePath } from '@/lib/config/database.config';
import { Database, RunResult } from 'sqlite3'; // Import RunResult
import logger from '@/lib/logger';

// REMOVE THESE LINES FROM MODULE SCOPE:
// const dbPath = getDatabaseFilePath();
// const db = new Database(dbPath);



export class ServiceLocalRepository implements IServiceRepository {
  private db: Database;

  constructor() {
    const dbPath = getDatabaseFilePath(); // Get path inside constructor
    logger.log(`ServiceLocalRepository: Attempting to initialize SQLite DB at ${dbPath}`);
    try {
      this.db = new Database(dbPath, (err) => { // Instantiate DB inside constructor
        if (err) {
          logger.error(`ServiceLocalRepository: FAILED to open SQLite DB at ${dbPath}`, err);
          // This error will propagate if MOCK_REPOSITORIES is true and the DB file is missing.
          // During a production build (MOCK_REPOSITORIES=false), this constructor shouldn't even be called.
          throw err;
        }
        logger.log(`ServiceLocalRepository: SQLite DB opened successfully at ${dbPath}`);
      });
    } catch (e) {
        logger.error(`ServiceLocalRepository: Critical exception during new Database() at ${dbPath}`, e);
        throw e;
    }
  }
  private getTableName(locale: string): string {
    return `services_${locale}`;
  }

  async getServices(locale: string): Promise<Service[]> {
    try {
      const tableName = this.getTableName(locale);
      const query = `SELECT * FROM ${tableName}`;
      const rows: ServiceDTO[] = await new Promise((resolve, reject) => {
        this.db.all(query, [], (err: Error | null, rows: ServiceDTO[]) => { // Add type annotation for err
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
      return rows.map(row => {
        if (typeof row?.keywords === 'string') {
          row.keywords = JSON.parse(row.keywords);
        }
        return ServiceMapper.toDomain(row);
      });
    } catch (error: unknown) {
      logger.error(`Error fetching services for locale ${locale}:`, error);
      throw new Error(`Failed to fetch services: ${(error as Error).message}`);
    }
  }

  async getServiceBySlug(slug: string, locale: string): Promise<Service | null> {
    try {
      const tableName = this.getTableName(locale);
      const query = `SELECT * FROM ${tableName} WHERE slug = ?`;
      const row: ServiceDTO | undefined = await new Promise((resolve, reject) => {
        this.db.get(query, [slug], (err: Error | null, row: ServiceDTO) => { // Add type annotation for err
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      if (typeof row?.keywords === 'string') {
        row.keywords = JSON.parse(row.keywords);
      }
      return row ? ServiceMapper.toDomain(row) : null;
    } catch (error: unknown) {
      logger.error(`Error fetching service with slug ${slug} for locale ${locale}:`, error);
      throw new Error(`Failed to fetch service by slug: ${(error as Error).message}`);
    }
  }

  async getServiceById(id: string, locale: string): Promise<Service | null> {
    try {
      const tableName = this.getTableName(locale);
      const query = `SELECT * FROM ${tableName} WHERE id = ?`;
      const row: ServiceDTO | undefined = await new Promise((resolve, reject) => {
        this.db.get(query, [id], (err: Error | null, row: ServiceDTO) => { // Add type annotation for err
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      if (typeof row?.keywords === 'string') {
        row.keywords = JSON.parse(row.keywords);
      }
      return row ? ServiceMapper.toDomain(row) : null;
    } catch (error: unknown) {
      logger.error(`Error fetching service with id ${id} for locale ${locale}:`, error);
      throw new Error(`Failed to fetch service by id: ${(error as Error).message}`);
    }
  }

  async createService(service: Partial<ServiceDTO>, locale: string): Promise<Service> {
    try {
      const tableName = this.getTableName(locale);
      // Generate ID and timestamps if not provided
      const now = new Date().toISOString();
      const serviceToInsert = {
        id: service.id || Date.now().toString(), // Simple mock ID
        created_at: service.created_at || now,
        updated_at: service.updated_at || now,
        is_published: service.is_published ?? true, // Default to true if not provided
        order_index: service.order_index ?? 0, // Default to 0 if not provided
        ...service,
      };

      const columns = Object.keys(serviceToInsert).join(', ');
      const placeholders = Object.keys(serviceToInsert).map(() => '?').join(', ');
      const values = Object.entries(serviceToInsert).map(([key, value]) => {
        if (key === 'keywords' && typeof value === 'object') {
          return JSON.stringify(value);
        }
        return value;
      });

      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

      await new Promise<void>((resolve, reject) => {
        this.db.run(query, values, function (err: Error | null) { // Add type annotation for err
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // Fetch the created service to return the full domain model
      const createdService = await this.getServiceById(serviceToInsert.id, locale);
      if (!createdService) {
        throw new Error('Failed to retrieve created service.');
      }
      return createdService;

    } catch (error: unknown) {
      logger.error(`Error creating service for locale ${locale}:`, error);
      throw new Error(`Failed to create service: ${(error as Error).message}`);
    }
  }

  async updateService(id: string, service: Partial<ServiceDTO>, locale: string): Promise<Service | null> {
    try {
      const tableName = this.getTableName(locale);
      const updates: string[] = [];
      const params: (string | number | boolean)[] = [];

      // Add updated_at timestamp
      const serviceUpdateWithTimestamp = {
        ...service,
        updated_at: new Date().toISOString(),
      };

      for (const [key, value] of Object.entries(serviceUpdateWithTimestamp)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          if (key === 'keywords' && typeof value === 'object') {
            params.push(JSON.stringify(value) as string);
          } else {
            params.push(value as string | number | boolean);
          }
        }
      }

      if (updates.length === 0) {
        return this.getServiceById(id, locale); // No updates to apply
      }

      params.push(id); // Add id for the WHERE clause

      const query = `UPDATE ${tableName} SET ${updates.join(', ')} WHERE id = ?`;

      await new Promise<void>((resolve, reject) => {
        this.db.run(query, params, function (err: Error | null) { // Add type annotation for err
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // Fetch the updated service to return the domain model
      return this.getServiceById(id, locale);

    } catch (error: unknown) {
      logger.error(`Error updating service with id ${id} for locale ${locale}:`, error);
      throw new Error(`Failed to update service: ${(error as Error).message}`);
    }
  }

  async deleteService(id: string, locale: string): Promise<boolean> {
    try {
      const tableName = this.getTableName(locale);
      const query = `DELETE FROM ${tableName} WHERE id = ?`;

      const result = await new Promise<number>((resolve, reject) => { // Specify return type as number
        this.db.run(query, [id], function (this: RunResult, err: Error | null) { // Add type annotation for this and err
          if (err) {
            reject(err);
          } else {
            resolve(this.changes); // 'this.changes' contains the number of rows affected
          }
        });
      });

      return result > 0; // Return true if at least one row was deleted

    } catch (error: unknown) {
      logger.error(`Error deleting service with id ${id} for locale ${locale}:`, error);
      throw new Error(`Failed to delete service: ${(error as Error).message}`);
    }
  }
}
// export singleton
export const serviceLocalRepository = new ServiceLocalRepository();