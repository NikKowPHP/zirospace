import { Locale } from "@/i18n"
import { CaseStudy } from "@/domain/models/case-study.model"

export interface ICaseStudyRepository {
  getCaseStudies: (locale: Locale) => Promise<CaseStudy[]>
  getCaseStudyBySlug: (slug: string, locale: Locale) => Promise<CaseStudy | null>
  createCaseStudy: (caseStudy: CaseStudy, locale: Locale) => Promise<CaseStudy>
  updateCaseStudy: (id: string, caseStudy: CaseStudy, locale: Locale) => Promise<CaseStudy>
  deleteCaseStudy: (id: string, locale: Locale) => Promise<void>
}