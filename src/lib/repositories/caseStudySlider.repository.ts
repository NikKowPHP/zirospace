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

  private toDomain(prismaSlider: any): CaseStudySlider {
    return {
      id: prismaSlider.id,
      createdAt: prismaSlider.created_at,
      updatedAt: prismaSlider.updated_at,
      images: prismaSlider.images.map((img: any) => ({
        id: img.id,
        image: img.image,
        alt: img.alt,
        createdAt: img.created_at,
        updatedAt: img.updated_at,
        sliderId: img.sliderId
      }))
    }
  }

  private toPrisma(slider: Partial<CaseStudySlider>): any {
    return {
      created_at: slider.createdAt,
      updated_at: slider.updatedAt,
      images: slider.images?.map(img => ({
        image: img.image,
        alt: img.alt,
        created_at: img.createdAt,
        updated_at: img.updatedAt,
        sliderId: img.sliderId
      }))
    }
  }

  async getCaseStudiesSliders(): Promise<CaseStudySlider[]> {
    try {
      const data = await this.prisma.caseStudySlider.findMany({
        include: { images: true },
        orderBy: { created_at: 'desc' }
      })
      return data.map(this.toDomain)
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
      return this.toDomain(created)
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
      return data ? this.toDomain(data) : null
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
      return this.toDomain(updated)
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