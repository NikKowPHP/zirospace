
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

// Mock 'next/cache' to bypass caching during tests
jest.mock('next/cache', () => ({
  unstable_cache: jest.fn((fn) => fn),
}))

// 1. Create the mock instance of prisma client first
const prismaMock = mockDeep<PrismaClient>()

// 2. Mock the prisma module and provide the pre-created mock instance
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: prismaMock,
}))

// 3. Import the service AFTER setting up the mocks
import { CaseStudyService } from '../case-study.service'

const caseStudyService = new CaseStudyService()

describe('CaseStudyService', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  describe('getCaseStudies', () => {
    it('should call prisma en model for "en" locale and return studies', async () => {
      const mockStudies = [
        { id: '1', title: 'English Study', order_index: 1, images: [] },
      ]
      // @ts-ignore
      prismaMock.zirospace_case_studies_en.findMany.mockResolvedValue(
        mockStudies
      )

      const result = await caseStudyService.getCaseStudies('en')

      expect(
        prismaMock.zirospace_case_studies_en.findMany
      ).toHaveBeenCalledWith({
        orderBy: { order_index: 'asc' },
        include: { images: true },
      })
      expect(result).toEqual(mockStudies)
    })

    it('should call prisma pl model for "pl" locale and return studies', async () => {
      const mockStudies = [
        { id: '1', title: 'Polish Study', order_index: 1, images: [] },
      ]
      // @ts-ignore
      prismaMock.zirospace_case_studies_pl.findMany.mockResolvedValue(
        mockStudies
      )

      const result = await caseStudyService.getCaseStudies('pl')

      expect(
        prismaMock.zirospace_case_studies_pl.findMany
      ).toHaveBeenCalledWith({
        orderBy: { order_index: 'asc' },
        include: { images: true },
      })
      expect(result).toEqual(mockStudies)
    })
  })

  describe('createCaseStudy', () => {
    it('should create a case study with its images for the "en" locale', async () => {
      const newStudyData = {
        title: 'New Study',
        description: 'A great new study',
        images: [{ url: 'image.jpg', alt: 'alt text' }],
      }
      const createdStudy = { id: 'new-id', ...newStudyData }

      // @ts-ignore
      prismaMock.zirospace_case_studies_en.create.mockResolvedValue(
        createdStudy
      )

      const result = await caseStudyService.createCaseStudy(newStudyData, 'en')

      expect(prismaMock.zirospace_case_studies_en.create).toHaveBeenCalledWith({
        data: {
          title: 'New Study',
          description: 'A great new study',
          images: {
            create: [{ url: 'image.jpg', alt: 'alt text' }],
          },
        },
      })
      expect(result).toEqual(createdStudy)
    })
  })

  describe('deleteCaseStudy', () => {
    it('should delete a case study by id for the "en" locale', async () => {
      // @ts-ignore
      prismaMock.zirospace_case_studies_en.delete.mockResolvedValue({ id: '1' })

      await caseStudyService.deleteCaseStudy('1', 'en')

      expect(prismaMock.zirospace_case_studies_en.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })
  })
})