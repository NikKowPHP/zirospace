import { ITestimonialRepository } from "../interfaces/testimonials.interface"
import { Testimonial } from "@/domain/models/testimonial.model"
import { testimonialRepositoryLocal } from "../repositories/testimonials.local.repository"
import { testimonialRepository } from "../repositories/testimonials.repository"

export class TestimonialService {
  private testimonialRepository: ITestimonialRepository
  constructor() {
    if(process.env.MOCK_REPOSITORIES === 'true') {
      this.testimonialRepository = testimonialRepositoryLocal
    } else {
      this.testimonialRepository = testimonialRepository // TODO: implement postgres repo
    }
  }

  getTestimonials = async (locale: string): Promise<Testimonial[]> => {
    return this.testimonialRepository.getTestimonials(locale)
  }

  getTestimonialById = async (id: string, locale: string): Promise<Testimonial | null> => {
    return this.testimonialRepository.getTestimonialById(id, locale)
  }

  createTestimonial = async (testimonial: Omit<Testimonial, 'id'>, locale: string): Promise<Testimonial> => {
    return this.testimonialRepository.createTestimonial(testimonial, locale)
  }

  updateTestimonial = async (id: string, testimonial: Partial<Testimonial>, locale: string): Promise<Testimonial | null> => {
    return this.testimonialRepository.updateTestimonial(id, testimonial, locale)
  }

  deleteTestimonial = async (id: string, locale: string): Promise<boolean> => {
    return this.testimonialRepository.deleteTestimonial(id, locale)
  }
}

// export singleton
export const testimonialService = new TestimonialService()

export const getTestimonialService = async () => {
  return new TestimonialService()
}