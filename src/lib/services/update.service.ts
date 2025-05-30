import { IUpdatesRepository } from '@/lib/interfaces/updatesRepository.interface'
import { UpdateRepository } from '@/lib/repositories/update.repository'
import { Update } from '@/domain/models/update.model'
import { generateSlug } from '@/lib/utils/slugify'
import logger from '../logger'

export class UpdateService {
  private updatesRepository: IUpdatesRepository

  constructor() {
    if (process.env.MOCK_REPOSITORIES === 'true') {
      const {
        UpdateRepositoryLocal,
      } = require('@/lib/repositories/update.local.repository')
      this.updatesRepository = new UpdateRepositoryLocal('en') // Locale might need to be dynamic or passed
    } else {
      this.updatesRepository = new UpdateRepository()
    }
  }

  async getUpdates(locale: string): Promise<Update[]> {
    return this.updatesRepository.getUpdates(locale)
  }

  async getUpdateBySlug(slug: string, locale: string): Promise<Update | null> {
    return this.updatesRepository.getUpdateBySlug(slug, locale)
  }

  async getUpdateById(id: string, locale: string): Promise<Update | null> {
    return this.updatesRepository.getUpdateById(id, locale)
  }

  async createUpdate(
    update: Omit<Update, 'id' | 'created_at' | 'updated_at' | 'slug'>,
    locale: string
  ): Promise<Update> {
    const slug = generateSlug(update.title)
    const newUpdate: Update = {
      ...update,
      id: crypto.randomUUID(),
      slug: slug,
      created_at: new Date(),
      updated_at: new Date(),
    }
    return this.updatesRepository.createUpdate(newUpdate, locale)
  }

  async updateUpdate(
    id: string,
    update: Omit<Update, 'id' | 'created_at' | 'updated_at' | 'slug'>,
    locale: string
  ): Promise<Update> {
    const existingUpdate = await this.getUpdateById(id, locale)
    if (!existingUpdate) {
      throw new Error(`Update with id ${id} not found`)
    }

    const slug = generateSlug(update.title)
    const updatedUpdate: Update = {
      ...existingUpdate,
      ...update,
      slug: slug,
      updated_at: new Date(),
    }
    return this.updatesRepository.updateUpdate(id, updatedUpdate, locale)
  }

  async deleteUpdate(id: string, locale: string): Promise<void> {
    logger.log(`Deleting update with id ${id} and locale ${locale}`)
    return this.updatesRepository.deleteUpdate(id, locale)
  }
}
