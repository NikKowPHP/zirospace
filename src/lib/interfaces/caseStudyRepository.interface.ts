import { Locale } from "@/i18n"
import { CaseStudy } from "@/domain/models/case-study.model"
import { OrderUpdate } from "../services/case-study.service"

export interface ICaseStudyRepository {
  getCaseStudies: (locale: Locale) => Promise<CaseStudy[]>
  getCaseStudyBySlug: (slug: string, locale: Locale) => Promise<CaseStudy | null>
  createCaseStudy: (caseStudy: Partial<CaseStudy>, locale: Locale) => Promise<CaseStudy>
  updateCaseStudy: (id: string, caseStudy: Partial<CaseStudy>, locale: Locale) => Promise<CaseStudy>
  deleteCaseStudy: (id: string, locale: Locale) => Promise<void>
  updateCaseStudyOrder: (orders: OrderUpdate[], locale: Locale) => Promise<void>
}