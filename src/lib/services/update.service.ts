import { Locale } from '@/i18n'
import { Update } from '@/domain/models/update.model'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { generateSlug } from '@/lib/utils/slugify'
import { CACHE_TAGS } from '@/lib/utils/cache'
import logger from '@/lib/logger'

export class UpdateService {
  private getModel(locale: Locale) {
    return locale === 'pl' ? prisma.updatePL : prisma.updateEN
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
    const slug = generateSlug(update.title || '') // Ensure title is not undefined
    const model = this.getModel(locale)
    return (model as any).create({
      data: {
        ...update,
        slug: slug,
      } as any,
    })
  }

  async updateUpdate(
    id: string,
    update: Partial<Update>,
    locale: Locale
  ): Promise<Update> {
    const slug = update.title ? generateSlug(update.title) : undefined // Generate slug only if title is provided
    const model = this.getModel(locale)
    return (model as any).update({
      where: { id },
      data: {
        ...update,
        ...(slug && { slug }), // Only add slug if it was generated
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
