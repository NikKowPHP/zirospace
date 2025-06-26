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
    return locale === 'pl'
      ? prisma.zirospace_case_studies_pl
      : prisma.zirospace_case_studies_en
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
          include: {
            images: true,
          },
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
      include: {
        images: true,
      },
    })
  }

  async createCaseStudy(
    caseStudy: Partial<CaseStudy>,
    locale: Locale
  ): Promise<CaseStudy> {
    const model = this.getModel(locale)
    const { images, ...caseStudyData } = caseStudy

    return (model as any).create({
      data: {
        ...caseStudyData,
        // Use a nested write to create the related images
        images: {
          create: images?.map((img) => ({
            url: img.url,
            alt: img.alt,
          })),
        },
      } as any,
    })
  }

  async updateCaseStudy(
    id: string,
    caseStudy: Partial<CaseStudy>,
    locale: Locale
  ): Promise<CaseStudy> {
    const { images, ...caseStudyData } = caseStudy

    return prisma.$transaction(async (tx) => {
      const txCaseStudyModel =
        locale === 'pl'
          ? tx.zirospace_case_studies_pl
          : tx.zirospace_case_studies_en
      const txImageModel =
        locale === 'pl' ? tx.caseStudyImagePL : tx.caseStudyImageEN

      await (txCaseStudyModel as any).update({
        where: { id },
        data: caseStudyData as any,
      })

      if (images) {
        await (txImageModel as any).deleteMany({
          where: { caseStudyId: id },
        })

        if (images.length > 0) {
          await (txImageModel as any).createMany({
            data: images.map((img) => ({
              url: img.url,
              alt: img.alt,
              caseStudyId: id,
            })),
          })
        }
      }

      const result = await (txCaseStudyModel as any).findUnique({
        where: { id },
        include: { images: true },
      })

      if (!result) {
        throw new Error('Failed to retrieve updated case study.')
      }

      return result
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
