import { YoutubeModel } from "@/domain/models/models";
import { getDatabaseFilePath } from "@/lib/config/database.config";
import { Database } from "sqlite3";
import logger from "@/lib/logger";

export class YoutubeRepositoryLocal {
  private db: Database;
  private tableName: string = "youtube"; // Ensure your table is named "youtube"

  constructor() {
    const dbPath = getDatabaseFilePath();
    this.db = new Database(dbPath);
  }

  /**
   * Retrieves the single YouTube entry.
   */
  async getYoutube(): Promise<YoutubeModel | null> {
    const query = `SELECT * FROM ${this.tableName} LIMIT 1`;
    return new Promise((resolve, reject) => {
      this.db.get(query, [], (err, row) => {
        if (err) {
          logger.log("Error fetching YouTube entry:", err);
          return reject(err);
        }
        if (!row) {
          return resolve(null);
        }
        resolve(row as YoutubeModel);
      });
    });
  }

  /**
   * Updates the YouTube URL in the single record.
   * @param youtube_url - The new YouTube URL.
   */
  async updateYoutube(youtube_url: string): Promise<YoutubeModel | null> {
    // First, retrieve the existing record (assuming it exists)
    const existing = await this.getYoutube();
    if (!existing) {
      logger.log("No existing YouTube entry found to update");
      return null;
    }

    const query = `UPDATE ${this.tableName} SET youtube_url = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(query, [youtube_url, existing.id], (err: Error | null) => {
        if (err) {
          logger.log("Error updating YouTube entry:", err);
          return reject(err);
        }
        resolve(null);
      });
    }).then(async () => {
      // Fetch the updated record and return it.
      return await this.getYoutube();
    });
  }
}

// Export a singleton instance of the repository
export const youtubeRepositoryLocal = new YoutubeRepositoryLocal();