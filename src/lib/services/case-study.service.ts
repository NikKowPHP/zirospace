import { Locale } from '@/i18n'
import { CaseStudy } from '@/domain/models/models'
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
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getCaseStudies(locale: Locale): Promise<CaseStudy[]> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findMany({
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
    const model = this.getModel(locale)
    return (model as any).findFirst({
      where: { slug },
    })
  }

  async createCaseStudy(
    caseStudy: Partial<CaseStudy>,
    locale: Locale
  ): Promise<CaseStudy> {
    const model = this.getModel(locale)
    return (model as any).create({
      data: caseStudy as any,
    })
  }

  async updateCaseStudy(
    id: string,
    caseStudy: Partial<CaseStudy>,
    locale: Locale
  ): Promise<CaseStudy> {
    const model = this.getModel(locale)
    return (model as any).update({
      where: { id },
      data: caseStudy as any,
    })
  }

  async deleteCaseStudy(id: string, locale: Locale): Promise<void> {
    const model = this.getModel(locale)
    await (model as any).delete({
      where: { id },
    })
  }

  async updateCaseStudyOrder(
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

export const caseStudyService = new CaseStudyService()
