import { IUpdatesRepository } from "@/lib/interfaces/updatesRepository.interface";
import { UpdateRepository } from "@/lib/repositories/update.repository";
import { UpdateRepositoryLocal } from "@/lib/repositories/update.local.repository";
import { Update } from "@/domain/models/update.model";
import { generateSlug } from "@/lib/utils/slugify";

export class UpdateService {
  private updatesRepository: IUpdatesRepository;

  constructor() {
    this.updatesRepository = process.env.MOCK_REPOSITORIES
      ? new UpdateRepositoryLocal()
      : new UpdateRepository();
  }

  async getUpdates(): Promise<Update[]> {
    return this.updatesRepository.getUpdates();
  }

  async getUpdateBySlug(slug: string): Promise<Update | null> {
    return this.updatesRepository.getUpdateBySlug(slug);
  }

  async getUpdateById(id: string): Promise<Update | null> {
    return this.updatesRepository.getUpdateById(id);
  }

  async createUpdate(update: Omit<Update, 'id' | 'createdAt' | 'updatedAt' | 'slug'>): Promise<Update> {
    const slug = generateSlug(update.title);
    const newUpdate: Update = {
      ...update,
      id: crypto.randomUUID(),
      slug: slug,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return this.updatesRepository.createUpdate(newUpdate);
  }

  async updateUpdate(id: string, update: Omit<Update, 'id' | 'created_at' | 'updated_at' | 'slug'>): Promise<Update> {
    const existingUpdate = await this.getUpdateById(id);
    if (!existingUpdate) {
      throw new Error(`Update with id ${id} not found`);
    }

    const slug = generateSlug(update.title);
    const updatedUpdate: Update = {
      ...existingUpdate,
      ...update,
      slug: slug,
      updated_at: new Date(),
    };
    return this.updatesRepository.updateUpdate(id, updatedUpdate);
  }

  async deleteUpdate(id: string): Promise<void> {
    return this.updatesRepository.deleteUpdate(id);
  }
}