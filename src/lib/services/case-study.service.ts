import { Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/models'
// import { prisma } from '@/lib/prisma';
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export interface OrderUpdate {
  id: string
  order: number
}

export class CaseStudyService {
  private getModel(locale: Locale) {
    return locale === 'pl' ? prisma.caseStudyPL : prisma.caseStudyEN
  }
  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, key, { tags }) as T
  }

  async getCaseStudies(locale: Locale): Promise<CaseStudy[]> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        return this.getModel(locale).findMany({
          orderBy: { order_index: 'asc' },
        })
      },
      `case-studies-${locale}`,
      [CACHE_TAGS.CASE_STUDIES, `case-studies:${locale}`]
    )

    return cachedFn(locale)
  }

  async getCaseStudyBySlug(
    slug: string,
    locale: Locale
  ): Promise<CaseStudy | null> {
    return this.getModel(locale).findFirst({
      where: { slug },
    })
  }

  async createCaseStudy(
    caseStudy: Partial<CaseStudy>,
    locale: Locale
  ): Promise<CaseStudy> {
    return this.getModel(locale).create({
      data: caseStudy,
    })
  }

  async updateCaseStudy(
    id: string,
    caseStudy: Partial<CaseStudy>,
    locale: Locale
  ): Promise<CaseStudy> {
    return this.getModel(locale).update({
      where: { id },
      data: caseStudy,
    })
  }

  async deleteCaseStudy(id: string, locale: Locale): Promise<void> {
    await this.getModel(locale).delete({
      where: { id },
    })
  }

  async updateCaseStudyOrder(
    orders: OrderUpdate[],
    locale: Locale
  ): Promise<void> {
    const model = this.getModel(locale)
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

export const caseStudyService = new CaseStudyService()
