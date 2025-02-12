import { Locale } from "@/i18n"
import { CaseStudyRepository } from "../repositories/caseStudy.repository"
import { CaseStudy } from "@/domain/models/case-study.model"
import { caseStudyRepositoryLocal } from "../repositories/caseStudy.local.repository"
import { ICaseStudyRepository } from "../interfaces/caseStudyRepository.interface"


const caseStudyRepository = new CaseStudyRepository()



export class CaseStudyService {
  private caseStudyRepository: ICaseStudyRepository
  constructor() {
    if(process.env.MOCK_REPOSITORIES === 'true') {
      this.caseStudyRepository = caseStudyRepositoryLocal
    } else {
      this.caseStudyRepository = caseStudyRepository
    }
  }

  getCaseStudies = async (locale: Locale): Promise<CaseStudy[]> => {
    return this.caseStudyRepository.getCaseStudies(locale)
  }

  getCaseStudyBySlug = async (slug: string, locale: Locale): Promise<CaseStudy | null> => {
    return this.caseStudyRepository.getCaseStudyBySlug(slug, locale)
  }

  createCaseStudy = async (caseStudy: Partial<CaseStudy>, locale: Locale): Promise<CaseStudy> => {
    return this.caseStudyRepository.createCaseStudy(caseStudy, locale)
  }

  updateCaseStudy = async (id: string, caseStudy: Partial<CaseStudy>, locale: Locale): Promise<CaseStudy> => {
    return this.caseStudyRepository.updateCaseStudy(id, caseStudy, locale);
  }

  deleteCaseStudy = async (id: string, locale: Locale): Promise<void> => {
    return this.caseStudyRepository.deleteCaseStudy(id, locale)
  }
}

// export singleton
export const caseStudyService = new CaseStudyService()

export const getCaseStudyService = async () => {
  return new CaseStudyService()
}