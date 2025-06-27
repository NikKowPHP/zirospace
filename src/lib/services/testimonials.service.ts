import { Locale } from '@/i18n'
import { Testimonial } from '@/domain/models/models'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'

export class TestimonialService {
  private getModel(locale: Locale) {
    return locale === 'pl' ? prisma.zirospace_testimonials_pl : prisma.zirospace_testimonials_en
  }

  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getTestimonials(locale: Locale): Promise<Testimonial[]> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findMany()
      },
      `testimonials-${locale}`,
      [CACHE_TAGS.TESTIMONIALS, `testimonials:${locale}`]
    )
    return cachedFn(locale)
  }

  async getTestimonialById(
    id: string,
    locale: Locale
  ): Promise<Testimonial | null> {
    const model = this.getModel(locale)
    return (model as any).findFirst({
      where: { id },
    })
  }

  async createTestimonial(
    testimonial: Partial<Testimonial>,
    locale: Locale
  ): Promise<Testimonial> {
    const model = this.getModel(locale)
    return (model as any).create({
      data: testimonial as any,
    })
  }

  async updateTestimonial(
    id: string,
    testimonial: Partial<Testimonial>,
    locale: Locale
  ): Promise<Testimonial> {
    const model = this.getModel(locale)
    return (model as any).update({
      where: { id },
      data: testimonial as any,
    })
  }

  async deleteTestimonial(id: string, locale: Locale): Promise<boolean> {
    const model = this.getModel(locale)
    try {
      await (model as any).delete({
        where: { id },
      })
      return true
    } catch (error) {
      console.error(`Failed to delete testimonial with ID ${id}:`, error)
      return false
    }
  }
}

export const testimonialService = new TestimonialService()