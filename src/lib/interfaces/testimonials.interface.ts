import { Locale } from "@/i18n"
import { Testimonial } from "@/domain/models/testimonial.model"

export interface ITestimonialRepository {
  getTestimonials: (locale: Locale) => Promise<Testimonial[]>
  getTestimonialById: (id: string, locale: Locale) => Promise<Testimonial | null>
  createTestimonial: (testimonial: Omit<Testimonial, 'id'>, locale: Locale) => Promise<Testimonial>
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>, locale: Locale) => Promise<Testimonial | null>
  deleteTestimonial: (id: string, locale: Locale) => Promise<boolean>
}