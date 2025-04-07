import { PrismaClient } from '@prisma/client'
import logger from '@/lib/logger'
import prisma from '@/lib/prisma'
import { CaseStudyImage, CaseStudySlider } from '@/domain/models/models'

export interface ICaseStudySliderRepository {
  getCaseStudiesSliders(): Promise<CaseStudySlider[]>
  createCaseStudySlider(caseStudySlider: Omit<CaseStudySlider, 'id' | 'createdAt' | 'updatedAt'>): Promise<CaseStudySlider>
  getCaseStudySliderById(id: string): Promise<CaseStudySlider | null>
  updateCaseStudySlider(id: string, caseStudySlider: Partial<CaseStudySlider>): Promise<CaseStudySlider | null>
  deleteCaseStudySlider(id: string): Promise<void>
}

export class CaseStudySliderRepository implements ICaseStudySliderRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }



  async getCaseStudiesSliders(): Promise<CaseStudySlider[]> {
    try {
      const data = await this.prisma.caseStudySlider.findMany({
        include: { images: true },
        orderBy: { created_at: 'desc' }
      })
      return data
    } catch (error) {
      logger.log('Error fetching sliders:', error)
      return []
    }
  }

  async createCaseStudySlider(caseStudySlider: Omit<CaseStudySlider, 'id' | 'createdAt' | 'updatedAt'>): Promise<CaseStudySlider> {
    try {
      const created = await this.prisma.caseStudySlider.create({
        data: {
          created_at: new Date(),
          updated_at: new Date(),
          images: {
            create: caseStudySlider.images?.map(img => ({
              image: img.image,
              alt: img.alt,
              created_at: new Date(),
              updated_at: new Date()
            }))
          }
        },
        include: { images: true }
      })
      return created;
    } catch (error) {
      logger.log('Error creating slider:', error)
      throw new Error(`Failed to create slider: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getCaseStudySliderById(id: string): Promise<CaseStudySlider | null> {
    try {
      const data = await this.prisma.caseStudySlider.findUnique({
        where: { id },
        include: { images: true }
      })
      return data;
    } catch (error) {
      logger.log('Error fetching slider:', error)
      return null
    }
  }

  async updateCaseStudySlider(id: string, caseStudySlider: Partial<CaseStudySlider>): Promise<CaseStudySlider | null> {
    try {
      const updated = await this.prisma.caseStudySlider.update({
        where: { id },
        data: {
          updated_at: new Date(),
          images: caseStudySlider.images && {
            deleteMany: {},
            create: caseStudySlider.images.map(img => ({
              image: img.image,
              alt: img.alt,
              created_at: img.createdAt || new Date(),
              updated_at: new Date()
            }))
          }
        },
        include: { images: true }
      })
      return updated;
    } catch (error) {
      logger.log('Error updating slider:', error)
      return null
    }
  }

  async deleteCaseStudySlider(id: string): Promise<void> {
    try {
      await this.prisma.$transaction([
        this.prisma.caseStudyImage.deleteMany({ where: { sliderId: id } }),
        this.prisma.caseStudySlider.delete({ where: { id } })
      ])
    } catch (error) {
      logger.log('Error deleting slider:', error)
      throw new Error(`Failed to delete slider: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export const caseStudySliderRepository = new CaseStudySliderRepository(prisma)
