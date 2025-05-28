import { Update } from "@/domain/models/update.model";

export interface IUpdatesRepository {
  getUpdates(locale: string): Promise<Update[]>;
  getUpdateBySlug(slug: string): Promise<Update | null>;
  getUpdateById(id: string): Promise<Update | null>;
  createUpdate(update: Update): Promise<Update>;
  updateUpdate(id: string, update: Update): Promise<Update>;
  deleteUpdate(id: string): Promise<void>;
}