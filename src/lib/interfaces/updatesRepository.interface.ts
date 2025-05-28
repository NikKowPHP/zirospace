import { Update } from "@/domain/models/update.model";

export interface IUpdatesRepository {
  getUpdates(locale: string): Promise<Update[]>;
  getUpdateBySlug(slug: string, locale: string): Promise<Update | null>;
  getUpdateById(id: string, locale: string): Promise<Update | null>;
  createUpdate(update: Update, locale: string): Promise<Update>;
  updateUpdate(id: string, update: Update, locale: string): Promise<Update>;
  deleteUpdate(id: string, locale: string): Promise<void>;
}