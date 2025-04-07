
import { PrismaClient } from '@prisma/client'
import { Testimonial } from '@/domain/models/models'
import { ITestimonialRepository } from '../interfaces/testimonials.interface'
import logger from '@/lib/logger'
import prisma from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache'
import { TestimonialMapper } from '@/infrastructure/mappers/testimonial.mapper'


export class TestimonialRepository implements ITestimonialRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getTestimonials(locale: string): Promise<Testimonial[]> {
    try {
      const testimonials = await this.prisma.testimonial.findMany({
        where: { locale },
        orderBy: { createdAt: 'desc' },
      })

      return testimonials
    } catch (error) {
      logger.log('Error fetching testimonials:', error)
      return []
    }
  }

  async getTestimonialById(id: string, locale: string): Promise<Testimonial | null> {
    try {
      const testimonial = await this.prisma.testimonial.findFirst({
        where: { id, locale },
      })

      return testimonial
    } catch (error) {
      logger.log('Error fetching testimonial by ID:', error)
      return null
    }
  }

  async createTestimonial(testimonial: Omit<Testimonial, 'id'>, locale: string): Promise<Testimonial> {
    try {
      const createdTestimonial = await this.prisma.testimonial.create({
        data: { ...testimonial, locale },
      })

      return createdTestimonial
    } catch (error) {
      logger.log('Error creating testimonial:', error)
      throw new Error('Failed to create testimonial')
    }
  }

  async updateTestimonial(id: string, testimonial: Partial<Testimonial>, locale: string): Promise<Testimonial | null> {
    try {
      const updatedTestimonial = await this.prisma.testimonial.update({
        where: { id },
        data: testimonial,
      })

      return updatedTestimonial
    } catch (error) {
      logger.log('Error updating testimonial:', error)
      return null
    }
  }

  async deleteTestimonial(id: string, locale: string): Promise<boolean> {
    try {
      await this.prisma.testimonial.delete({
        where: { id },
      })

      return true
    } catch (error) {
      logger.log('Error deleting testimonial:', error)
      return false
    }
  }
}

export const testimonialRepository = new TestimonialRepository(prisma)
