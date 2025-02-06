import { Pool, PoolClient } from 'pg';

// Define a generic interface for entities, requiring an 'id' property.
// You can adjust this if your entities have a different primary key name.
export interface BaseEntity<ID> {
  id: ID;
}

export class PostgresDBRepository<T extends BaseEntity<ID>, ID> {
  private tableName: string;
  private pool: Pool;

  constructor(tableName: string, pool: Pool) {
    this.tableName = tableName;
    this.pool = pool;
  }

  /**
   * Creates a new entity in the database.
   * @param {Omit<T, 'id'>} entity - The entity data to create, excluding the ID (which is often auto-generated).
   * @returns {Promise<T>} - The newly created entity, including its generated ID.
   * @throws {Error} - If there's a database error during creation.
   */
  async create(entity: Omit<T, 'id'>): Promise<T> {
    const client = await this.pool.connect(); // Get a client from the pool
    try {
      const columns = Object.keys(entity).join(', ');
      const values = Object.values(entity);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

      const query = `
        INSERT INTO "${this.tableName}" (${columns})
        VALUES (${placeholders})
        RETURNING *;
      `;
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error(`Failed to create entity in table "${this.tableName}".`);
      }
      return result.rows[0] as T;
    } catch (error: unknown) {
      console.error(`Error creating entity in table "${this.tableName}":`, error);
      throw new Error(`Database error creating entity in table "${this.tableName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release(); // Release the client back to the pool
    }
  }

  /**
   * Reads an entity from the database by its ID.
   * @param {ID} id - The ID of the entity to retrieve.
   * @returns {Promise<T | null>} - The entity if found, otherwise null.
   * @throws {Error} - If there's a database error during retrieval.
   */
  async read(id: ID): Promise<T | null> {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM "${this.tableName}"
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        return null; // Entity not found
      }
      return result.rows[0] as T;
    } catch (error: unknown) {
      console.error(`Error reading entity from table "${this.tableName}" with ID ${id}:`, error);
      throw new Error(`Database error reading entity from table "${this.tableName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  /**
   * Updates an existing entity in the database by its ID.
   * @param {ID} id - The ID of the entity to update.
   * @param {Partial<T>} entityUpdate - An object containing the fields to update and their new values.
   * @returns {Promise<T | null>} - The updated entity if successful, otherwise null.
   * @throws {Error} - If there's a database error during update.
   */
  async update(id: ID, entityUpdate: Partial<T>): Promise<T | null> {
    const client = await this.pool.connect();
    try {
      const updates = Object.keys(entityUpdate)
        .map((key, index) => `"${key}" = $${index + 2}`) // Start index from 2 because $1 is ID
        .join(', ');
      const values = Object.values(entityUpdate);

      const query = `
        UPDATE "${this.tableName}"
        SET ${updates}
        WHERE id = $1
        RETURNING *;
      `;
      const result = await client.query(query, [id, ...values]);
      if (result.rows.length === 0) {
        return null; // Entity not found or not updated
      }
      return result.rows[0] as T;
    } catch (error: unknown) {
      console.error(`Error updating entity in table "${this.tableName}" with ID ${id}:`, error);
      throw new Error(`Database error updating entity in table "${this.tableName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  /**
   * Deletes an entity from the database by its ID.
   * @param {ID} id - The ID of the entity to delete.
   * @returns {Promise<boolean>} - True if the entity was successfully deleted, false otherwise.
   * @throws {Error} - If there's a database error during deletion.
   */
  async delete(id: ID): Promise<boolean | null | 0> {
    const client = await this.pool.connect();
    try {
      const query = `
        DELETE FROM "${this.tableName}"
        WHERE id = $1
        RETURNING id;
      `;
      const result = await client.query(query, [id]);
      return result.rowCount && result.rowCount > 0; // Returns true if at least one row was deleted
    } catch (error: unknown) {
      console.error(`Error deleting entity from table "${this.tableName}" with ID ${id}:`, error);
      throw new Error(`Database error deleting entity from table "${this.tableName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }

  /**
   * Lists all entities from the database table.
   * @returns {Promise<T[]>} - An array of all entities in the table.
   * @throws {Error} - If there's a database error during listing.
   */
  async list(): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM "${this.tableName}";
      `;
      const result = await client.query(query);
      return result.rows as T[];
    } catch (error) {
      console.error(`Error listing entities from table "${this.tableName}":`, error);
      throw new Error(`Database error listing entities from table "${this.tableName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      client.release();
    }
  }
}
