import { Locale } from "@/i18n"
import { CaseStudy } from "@/domain/models/case-study.model"
import { CaseStudyDTO } from "@/infrastructure/dto/case-study.dto"

export interface ICaseStudyRepository {
  getCaseStudies: (locale: Locale) => Promise<CaseStudy[]>
  getCaseStudyBySlug: (slug: string, locale: Locale) => Promise<CaseStudy | null>
  createCaseStudy: (caseStudy: CaseStudy, locale: Locale) => Promise<CaseStudy>
  updateCaseStudy: (id: string, caseStudy: Partial<CaseStudy>, locale: Locale) => Promise<CaseStudy>
  deleteCaseStudy: (id: string, locale: Locale) => Promise<void>
}