// 'use server'

// import { revalidateTag } from 'next/cache'
// import { CACHE_TAGS } from '@/lib/utils/cache'
// import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'
// import { caseStudyService } from '@/lib/services/case-study.service'
// import logger from '@/lib/logger'
// import { CaseStudy } from '@/domain/models/models'

// export async function createCaseStudyAction(data: Partial<CaseStudy>, locale: string) {
//   try {
//     console.log('Processing case study creation:', {
//       locale,
//       mappedData: CaseStudyMapper.toPersistence(data)
//     })
    
//     // Generate id
//     const id = crypto.randomUUID()
//     data.id = id
    
//     const newCaseStudy = await caseStudyService.createCaseStudy(
//       CaseStudyMapper.toPersistence(data),
//       locale
//     )

//     // Revalidate cache
//     revalidateTag(CACHE_TAGS.CASE_STUDIES)

//     return { success: true, data: newCaseStudy }
//   } catch (error) {
//     logger.log('Error creating case study:', error)
//     throw new Error(`Failed to create case study: ${error instanceof Error ? error.message : 'Unknown error'}`)
//   }
// }

// export async function updateCaseStudyAction(id: string, data: Partial<CaseStudy>, locale: string) {
//   try {
//     console.log('Processing case study update:', {
//       id,
//       locale,
//       mappedToPersistance: CaseStudyMapper.toPersistence(data),
//     })

//     const updatedCaseStudy = await caseStudyService.updateCaseStudy(
//       id,
//       data,
//       locale
//     )

//     console.log('updatedCaseStudy after response', updatedCaseStudy)

//     // Revalidate cache
//     revalidateTag(CACHE_TAGS.CASE_STUDIES)

//     return { success: true, data: updatedCaseStudy }
//   } catch (error) {
//     logger.log('Error updating case study:', error)
//     throw new Error(`Failed to update case study: ${error instanceof Error ? error.message : 'Unknown error'}`)
//   }
// }

// export async function deleteCaseStudyAction(id: string, locale: string) {
//   try {
//     console.log('Processing case study deletion:', { id, locale })

//     await caseStudyService.deleteCaseStudy(id, locale)

//     // Revalidate cache
//     revalidateTag(CACHE_TAGS.CASE_STUDIES)

//     return { success: true }
//   } catch (error) {
//     logger.log('Error deleting case study:', error)
//     throw new Error(`Failed to delete case study: ${error instanceof Error ? error.message : 'Unknown error'}`)
//   }
// }

// export async function updateCaseStudyOrderAction(orders: Array<{ id: string, order: number }>, locale: string) {
//   try {
//     console.log('Processing case study order update:', { orders, locale })
    
//     await caseStudyService.updateCaseStudyOrder(orders, locale)

//     // Revalidate cache
//     revalidateTag(CACHE_TAGS.CASE_STUDIES)

//     return { success: true }
//   } catch (error) {
//     logger.log('Error updating case study order:', error)
//     throw new Error(`Failed to update case study order: ${error instanceof Error ? error.message : 'Unknown error'}`)
//   }
// }

// export async function getCaseStudiesAction(locale: string) {
//   try {
//     const caseStudies = await caseStudyService.getCaseStudies(locale)
//     return { success: true, data: caseStudies }
//   } catch (error) {
//     logger.log('Error fetching case studies:', error)
//     throw new Error(`Failed to fetch case studies: ${error instanceof Error ? error.message : 'Unknown error'}`)
//   }
// }

// export async function getCaseStudyByIdAction(id: string, locale: string) {
//   try {
//     const caseStudy = await caseStudyService.getCaseStudyById(id, locale)
//     return { success: true, data: caseStudy }
//   } catch (error) {
//     logger.log('Error fetching case study:', error)
//     throw new Error(`Failed to fetch case study: ${error instanceof Error ? error.message : 'Unknown error'}`)
//   }
// }