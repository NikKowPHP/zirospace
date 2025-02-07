import { Testimonial } from "@/domain/models/testimonial.model"

export interface ITestimonialRepository {
  getTestimonials: (locale: string) => Promise<Testimonial[]>
  getTestimonialById: (id: string, locale: string) => Promise<Testimonial | null>
  createTestimonial: (testimonial: Omit<Testimonial, 'id'>, locale: string) => Promise<Testimonial>
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>, locale: string) => Promise<Testimonial | null>
  deleteTestimonial: (id: string, locale: string) => Promise<boolean>
}