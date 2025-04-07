// src/lib/repositories/caseStudy.repository.ts
import { PrismaClient } from '@prisma/client'
import { Locale } from '@/i18n'
import logger from '@/lib/logger'
import prisma from '@/lib/prisma'
import { OrderUpdate } from '../services/case-study.service'
// Import updated domain models, including CaseStudyImage
import { CaseStudy, CaseStudyImage } from '@/domain/models/models'

// --- Define Input Types ---

// Input for creating a single image within a case study creation
export type CaseStudyImageCreateInput = Omit<CaseStudyImage, 'id' | 'created_at' | 'updated_at' | 'caseStudyId'>;

// Input for creating a CaseStudy, including optional images
export type CaseStudyCreateInput = Omit<CaseStudy, 'id' | 'created_at' | 'updated_at' | 'images'> & {
  images?: CaseStudyImageCreateInput[]; // Array of image data to create
};

// Input for updating only the scalar fields of a CaseStudy
// Image updates should be handled separately or via a different strategy.
export type CaseStudyUpdateInput = Partial<Omit<CaseStudy, 'id' | 'created_at' | 'updated_at' | 'images' | 'locale'>>;

// --- Repository Interface ---

export interface ICaseStudyRepository {
  getCaseStudies(locale: Locale): Promise<CaseStudy[]>
  getCaseStudyBySlug(slug: string, locale: Locale): Promise<CaseStudy | null>
  createCaseStudy(caseStudyData: CaseStudyCreateInput, locale: Locale): Promise<CaseStudy | null>
  updateCaseStudy(id: string, caseStudyData: CaseStudyUpdateInput, locale: Locale): Promise<CaseStudy | null>
  deleteCaseStudy(id: string, locale: Locale): Promise<boolean>
  updateCaseStudyOrder(orders: OrderUpdate[], locale: Locale): Promise<void>
  getCaseStudyById(id: string, locale: Locale): Promise<CaseStudy | null> // Add this line

}

// --- Repository Implementation ---

export class CaseStudyRepository implements ICaseStudyRepository {
  private prisma: PrismaClient

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient
  }

  async getCaseStudies(locale: Locale): Promise<CaseStudy[]> {
    try {
      const data = await this.prisma.caseStudy.findMany({
        where: { locale },
        orderBy: [{ order_index: 'asc' }, { created_at: 'desc' }], // Order by index, then date
        include: {
          images: { // Include related images
            orderBy: { created_at: 'asc' } // Order images consistently
          },
          tags: true

        }
      })
      // Prisma's return type with include should match the updated CaseStudy domain model
      return data;
    } catch (error) {
      logger.log('Error fetching case studies:', error)
      return []
    }
  }

  async getCaseStudyBySlug(slug: string, locale: Locale): Promise<CaseStudy | null> {
    try {
      const data = await this.prisma.caseStudy.findUnique({
        where: {
          slug_locale: { slug, locale }
        },
        include: {
          images: { // Include related images
            orderBy: { created_at: 'asc' }
          },
          tags: true
        }
      })
      // Prisma's return type with include should match the updated CaseStudy domain model
      return data;
    } catch (error) {
      logger.log('Error fetching case study:', error)
      return null
    }
  }

  async createCaseStudy(caseStudyData: CaseStudyCreateInput, locale: Locale): Promise<CaseStudy | null> {
    try {
      const { images, ...restData } = caseStudyData; // Separate image data

      const createdCaseStudy = await this.prisma.caseStudy.create({
        data: {
          ...restData, // Main case study data
          locale: locale, // Set the locale
          images: { // Use nested write to create related images
            create: images?.map(img => ({
              image: img.image,
              alt: img.alt,
            })) || [], // Handle case where images might be undefined/empty
          }
        },
        include: { // Ensure images are included in the returned object
          images: true
        }
      })
      return createdCaseStudy;
    } catch (error) {
      logger.log('Error creating case study:', error)
      // Consider throwing the error or returning a more specific error state
      return null
    }
  }

  async updateCaseStudy(id: string, caseStudyData: CaseStudyUpdateInput, locale: Locale): Promise<CaseStudy | null> {
    // As noted before, this only updates scalar fields. Image updates need separate handling.
    try {
      // Optional: Verify existence and locale before update
      const existing = await this.prisma.caseStudy.findUnique({ where: { id } });
      if (!existing || existing.locale !== locale) {
        logger.log(`Update failed: Case study ID ${id} not found or locale mismatch (expected ${locale}).`);
        return null;
      }

      const updatedCaseStudy = await this.prisma.caseStudy.update({
        where: { id },
        data: {
          ...caseStudyData, // Apply partial updates to scalar fields
        },
        include: { // Include images in the response
          images: true
        }
      })
      return updatedCaseStudy;
    } catch (error) {
      logger.log(`Error updating case study with ID ${id}:`, error)
      // Consider throwing the error or returning a more specific error state
      return null
    }
  }

  async deleteCaseStudy(id: string, locale: Locale): Promise<boolean> {
    try {
      // Optional: Verify existence and locale before delete
      const existing = await this.prisma.caseStudy.findUnique({ where: { id } });
      if (!existing || existing.locale !== locale) {
        logger.log(`Delete failed: Case study ID ${id} not found or locale mismatch (expected ${locale}).`);
        return false;
      }

      // `onDelete: Cascade` in the schema handles related image deletion
      await this.prisma.caseStudy.delete({
        where: { id }
      })
      return true
    } catch (error) {
      logger.log(`Error deleting case study with ID ${id}:`, error)
    }
  }

  async getCaseStudyById(id: string, locale: Locale): Promise<CaseStudy | null> {
    try {
      const data = await this.prisma.caseStudy.findUnique({
        where: {
          id: id,
          locale: locale // Ensure the fetched study matches the locale
        },
        include: {
          images: { // Include related images
            orderBy: { created_at: 'asc' }
          }
        },
        tags: true
      });
      // Prisma's return type with include should match the updated CaseStudy domain model
      return data;
    } catch (error) {
      logger.log(`Error fetching case study with ID ${id}:`, error);
      return null;
    }
  }


  async updateCaseStudyOrder(orders: OrderUpdate[], locale: Locale): Promise<void> {
    // This method remains unchanged as it only affects the 'order_index' scalar field.
    // This method remains unchanged as it only affects the 'order_index' scalar field.
    // Add locale check for safety if necessary.
    try {
      // Optional: Add locale check within the transaction if strictness is required.
      // This example assumes IDs are unique enough for this operation.
      await this.prisma.$transaction(
        orders.map(({ id, order }) =>
          this.prisma.caseStudy.update({
            where: { id, locale: locale }, // Add locale here if needed
            data: { order_index: order }
          })
        )
      )
    } catch (error) {
      logger.log('Error updating case study order:', error)
      throw error // Re-throw to indicate failure
    }
  }
}

// Export singleton instance
export const caseStudyRepository = new CaseStudyRepository(prisma)
