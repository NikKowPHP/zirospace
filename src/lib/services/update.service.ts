import { Locale } from '@/i18n'
import { Update } from '@/domain/models/models'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { generateSlug } from '@/lib/utils/slugify'
import { CACHE_TAGS } from '@/lib/utils/cache'
import logger from '@/lib/logger'

export class UpdateService {
  private getModel(locale: Locale) {
    return locale === 'pl'
      ? prisma.zirospace_updates_pl
      : prisma.zirospace_updates_en
  }

  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getUpdates(locale: Locale): Promise<Update[]> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findMany({
          orderBy: { order_index: 'asc' },
        })
      },
      `updates-${locale}`,
      [CACHE_TAGS.UPDATES, `updates:${locale}`]
    )
    return cachedFn(locale)
  }

  async getPublishedUpdates(locale: Locale): Promise<Update[]> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findMany({
          where: { is_published: true },
          orderBy: { publish_date: 'desc' },
        })
      },
      `published-updates-${locale}`,
      [CACHE_TAGS.UPDATES, `published-updates:${locale}`]
    )
    return cachedFn(locale)
  }

  async getUpdateBySlug(slug: string, locale: Locale): Promise<Update | null> {
    const model = this.getModel(locale)
    return (model as any).findFirst({
      where: { slug },
    })
  }

  async getUpdateById(id: string, locale: Locale): Promise<Update | null> {
    const model = this.getModel(locale)
    return (model as any).findFirst({
      where: { id },
    })
  }

  async createUpdate(update: Partial<Update>, locale: Locale): Promise<Update> {
    const model = this.getModel(locale)
    return (model as any).create({
      data: {
        ...update,
        created_at: update.created_at || new Date().toISOString(),
        updated_at: update.updated_at || new Date().toISOString(),
      } as any,
    })
  }

  async updateUpdate(
    id: string,
    update: Partial<Update>,
    locale: Locale
  ): Promise<Update> {
    const slug = update.title ? generateSlug(update.title) : undefined
    const model = this.getModel(locale)
    return (model as any).update({
      where: { id },
      data: {
        ...update,
        ...(slug && { slug }),
        updated_at: new Date().toISOString(),
      } as any,
    })
  }

  async deleteUpdate(id: string, locale: Locale): Promise<void> {
    logger.log(`Deleting update with id ${id} and locale ${locale}`)
    const model = this.getModel(locale)
    await (model as any).delete({
      where: { id },
    })
  }
}

export const updateService = new UpdateService()