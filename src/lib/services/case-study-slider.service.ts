import { Locale } from '@/i18n'
import { CaseStudySlider } from "@/domain/models/case-study-slider.model"
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export class CaseStudySliderService {
  private getModel() {
    return prisma.caseStudySlider
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
          orderBy: { orderIndex: 'asc' },
        })
      },
      `case-study-sliders`,
      [CACHE_TAGS.CASE_STUDY_SLIDERS]
    )
    return cachedFn()
  }

  async createCaseStudySlider(caseStudySlider: CaseStudySlider): Promise<CaseStudySlider> {
    const model = this.getModel()
    return (model as any).create({
      data: caseStudySlider as any,
    })
  }

  async updateCaseStudySlider(id: string, caseStudySlider: CaseStudySlider): Promise<CaseStudySlider> {
    const model = this.getModel()
    return (model as any).update({
      where: { id },
      data: caseStudySlider as any,
    })
  }

  async deleteCaseStudySlider(id: string): Promise<void> {
    const model = this.getModel()
    await (model as any).delete({
      where: { id },
    })
  }
}

export const caseStudySliderService = new CaseStudySliderService()
