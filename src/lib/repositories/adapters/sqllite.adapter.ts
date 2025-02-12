import { Database } from 'sqlite3';
import logger from '@/lib/logger'
export interface BaseEntity<ID> {
  id: ID;
}

export class SqlLiteAdapter<T extends BaseEntity<ID>, ID> {
  protected tableName: string;
  protected db: Database;

  constructor(tableName: string, db: Database) {
    this.tableName = tableName;
    this.db = db;
  }

  /**
   * Creates a new entity in the database.
   * @param {Omit<T, 'id'>} entity - The entity data to create, excluding the ID (which is often auto-generated).
   * @returns {Promise<T>} - The newly created entity, including its generated ID.
   * @throws {Error} - If there's a database error during creation.
   */
  async create(entity: Omit<T, 'id'>): Promise<T> {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(entity).join(', ');
      const values = Object.values(entity);
      const placeholders = values.map(() => '?').join(', ');

      const query = `
        INSERT INTO "${this.tableName}" (${columns})
        VALUES (${placeholders})
        RETURNING *;
      `;

      this.db.get(query, values, (err, row: T) => {
        if (err) {
          logger.log(`Error creating entity in table "${this.tableName}":`, err);
          reject(new Error(`Database error creating entity in table "${this.tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        if (!row) {
          reject(new Error(`Failed to create entity in table "${this.tableName}".`));
          return;
        }
        resolve(row);
      });
    });
  }

  /**
   * Reads an entity from the database by its ID.
   * @param {ID} id - The ID of the entity to retrieve.
   * @returns {Promise<T | null>} - The entity if found, otherwise null.
   * @throws {Error} - If there's a database error during retrieval.
   */
  async read(id: ID): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM "${this.tableName}"
        WHERE id = ?;
      `;

      this.db.get(query, [id], (err, row: T) => {
        if (err) {
          logger.log(`Error reading entity from table "${this.tableName}" with ID ${id}:`, err);
          reject(new Error(`Database error reading entity from table "${this.tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        resolve(row || null);
      });
    });
  }

  /**
   * Updates an existing entity in the database by its ID.
   * @param {ID} id - The ID of the entity to update.
   * @param {Partial<T>} entityUpdate - An object containing the fields to update and their new values.
   * @returns {Promise<T | null>} - The updated entity if successful, otherwise null.
   * @throws {Error} - If there's a database error during update.
   */
  async update(id: ID, entityUpdate: Partial<T>): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const updates = Object.keys(entityUpdate)
        .map((key) => `"${key}" = ?`)
        .join(', ');
      const values = Object.values(entityUpdate);

      const query = `
        UPDATE "${this.tableName}"
        SET ${updates}
        WHERE id = ?
        RETURNING *;
      `;

      this.db.get(query, [...values, id], (err, row: T) => {
        if (err) {
          logger.log(`Error updating entity in table "${this.tableName}" with ID ${id}:`, err);
          reject(new Error(`Database error updating entity in table "${this.tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        resolve(row || null);
      });
    });
  }

  /**
   * Deletes an entity from the database by its ID.
   * @param {ID} id - The ID of the entity to delete.
   * @returns {Promise<boolean>} - True if the entity was successfully deleted, false otherwise.
   * @throws {Error} - If there's a database error during deletion.
   */
  async delete(id: ID): Promise<boolean | null | 0> {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM "${this.tableName}"
        WHERE id = ?
        RETURNING id;
      `;

      this.db.get(query, [id], (err, row: { id: ID }) => {
        if (err) {
          logger.log(`Error deleting entity from table "${this.tableName}" with ID ${id}:`, err);
          reject(new Error(`Database error deleting entity from table "${this.tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        resolve(!!row);
      });
    });
  }

  /**
   * Lists all entities from the database table.
   * @returns {Promise<T[]>} - An array of all entities in the table.
   * @throws {Error} - If there's a database error during listing.
   */
  async list(...args: any[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM "${this.tableName}";
      `;

      this.db.all(query, args, (err, rows: T[]) => {
        if (err) {
          logger.log(`Error listing entities from table "${this.tableName}":`, err);
          reject(new Error(`Database error listing entities from table "${this.tableName}": ${err.message || 'Unknown error'}`));
          return;
        }
        resolve(rows || []);
      });
    });
  }
}
