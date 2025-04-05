import { PrismaClient } from '@prisma/client'
import { Locale } from '@/i18n'

import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
import logger from '@/lib/logger'
import prisma from '@/lib/prisma'
import { OrderUpdate } from '../services/case-study.service'
import { CaseStudy } from '@/domain/models/models'

export interface ICaseStudyRepository {
  getCaseStudies(locale: Locale): Promise<CaseStudy[]>
  getCaseStudyBySlug(slug: string, locale: Locale): Promise<CaseStudy | null>
  createCaseStudy(caseStudy: Partial<CaseStudy>, locale: Locale): Promise<CaseStudy | null>
  updateCaseStudy(id: string, caseStudy: Partial<CaseStudy>, locale: Locale): Promise<CaseStudy | null>
  deleteCaseStudy(id: string, locale: Locale): Promise<boolean>
  updateCaseStudyOrder(orders: OrderUpdate[], locale: Locale): Promise<void>
}

export class CaseStudyRepository implements ICaseStudyRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getCaseStudies(locale: Locale): Promise<CaseStudy[]> {
    try {
      const data = await this.prisma.caseStudy.findMany({
        where: { locale },
        orderBy: { created_at: 'desc' }
      })
      return data.map(CaseStudyMapper.toDomain)
    } catch (error) {
      logger.log('Error fetching case studies:', error)
      return []
    }
  }

  async getCaseStudyBySlug(slug: string, locale: Locale): Promise<CaseStudy | null> {
    try {
      const data = await this.prisma.caseStudy.findUnique({
        where: { 
          slug_locale: {
            slug,
            locale
          }
        }
      })
      return data ? CaseStudyMapper.toDomain(data) : null
    } catch (error) {
      logger.log('Error fetching case study:', error)
      return null
    }
  }

  async createCaseStudy(caseStudy: Partial<CaseStudy>, locale: Locale): Promise<CaseStudy | null> {
    try {
      const data = await this.prisma.caseStudy.create({
        data: CaseStudyMapper.toPersistence(caseStudy)
      })
      return CaseStudyMapper.toDomain(data)
    } catch (error) {
      logger.log('Error creating case study:', error)
      return null
    }
  }

  async updateCaseStudy(id: string, caseStudy: Partial<CaseStudy>, locale: Locale): Promise<CaseStudy | null> {
    try {
      const data = await this.prisma.caseStudy.update({
        where: { id },
        data: CaseStudyMapper.toPersistence(caseStudy)
      })
      return CaseStudyMapper.toDomain(data)
    } catch (error) {
      logger.log('Error updating case study:', error)
      return null
    }
  }

  async deleteCaseStudy(id: string, locale: Locale): Promise<boolean> {
    try {
      await this.prisma.caseStudy.delete({
        where: { id }
      })
      return true
    } catch (error) {
      logger.log('Error deleting case study:', error)
      return false
    }
  }

  async updateCaseStudyOrder(orders: OrderUpdate[], locale: Locale): Promise<void> {
    try {
      await this.prisma.$transaction(
        orders.map(({ id, order }) => 
          this.prisma.caseStudy.update({
            where: { id },
            data: { order_index: order }
          })
        )
      )
    } catch (error) {
      logger.log('Error updating case study order:', error)
      throw error
    }
  }
}

export const caseStudyRepository = new CaseStudyRepository(prisma)