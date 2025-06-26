import { CaseStudySlider } from '@/domain/models/models'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export class CaseStudySliderService {
  private getModel() {
    return prisma.zirospace_case_study_sliders
  }

  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getCaseStudySliders(): Promise<CaseStudySlider[]> {
    const cachedFn = this.withCache(
      async () => {
        const model = this.getModel()

        return (model as any).findMany({
          include: {
            images: true,
          },
        })
      },
      `case-study-sliders`,
      [CACHE_TAGS.CASE_STUDY_SLIDERS]
    )

    return cachedFn()
  }

  async createCaseStudySlider(
    caseStudySlider: Partial<CaseStudySlider>
  ): Promise<CaseStudySlider> {
    const model = this.getModel()
    return (model as any).create({
      data: caseStudySlider,
      include: {
        images: true,
      },
    })
  }

  async updateCaseStudySlider(
    id: string,
    caseStudySlider: Partial<CaseStudySlider>
  ): Promise<CaseStudySlider> {
    const { images, ...sliderData } = caseStudySlider

    return prisma.$transaction(async (tx) => {
      await (tx.zirospace_case_study_sliders as any).update({
        where: { id },
        data: {
          ...sliderData,
          images: {
            deleteMany: {},
            create: images?.map((img) => ({
              id: img.id,
              image: img.image,
              alt: img.alt,
            })),
          },
        },
      })

      return (tx.zirospace_case_study_sliders as any).findUniqueOrThrow({
        where: { id },
        include: { images: true },
      })
    })
  }

  async deleteCaseStudySlider(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await (tx.zirospace_case_study_slider_images as any).deleteMany({
        where: { slider_id: id },
      })
      await (tx.zirospace_case_study_sliders as any).delete({
        where: { id },
      })
    })
  }
}

export const caseStudySliderService = new CaseStudySliderService()
