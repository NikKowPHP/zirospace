
import { Locale } from '@/i18n'
import { Advisor } from '@/domain/models/models'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export interface OrderUpdate {
  id: string
  order: number
}

export class AdvisorService {
  private getModel(locale: Locale) {
    return locale === 'pl'
      ? prisma.zirospace_advisors_pl
      : prisma.zirospace_advisors_en
  }

  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getAdvisors(locale: Locale): Promise<Advisor[]> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findMany({
          orderBy: { order_index: 'asc' },
        })
      },
      `advisors-${locale}`,
      [CACHE_TAGS.ADVISORS, `advisors:${locale}`]
    )
    return cachedFn(locale)
  }

  async createAdvisor(
    advisor: Partial<Advisor>,
    locale: Locale
  ): Promise<Advisor> {
    const model = this.getModel(locale)
    return (model as any).create({
      data: advisor as any,
    })
  }

  async updateAdvisor(
    id: string,
    advisor: Partial<Advisor>,
    locale: Locale
  ): Promise<Advisor> {
    const model = this.getModel(locale)
    return (model as any).update({
      where: { id },
      data: advisor as any,
    })
  }

  async deleteAdvisor(id: string, locale: Locale): Promise<boolean> {
    const model = this.getModel(locale)
    try {
      await (model as any).delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error(`Failed to delete advisor with ID ${id}:`, error)
      return false
    }
  }

  async updateAdvisorOrder(
    orders: OrderUpdate[],
    locale: Locale
  ): Promise<void> {
    const model = this.getModel(locale) as any
    await prisma.$transaction(
      orders.map((order) =>
        model.update({
          where: { id: order.id },
          data: { order_index: order.order },
        })
      )
    )
  }
}

export const advisorService = new AdvisorService()