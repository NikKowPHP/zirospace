import { Locale } from "@/i18n"
import { CaseStudyRepository } from "../repositories/caseStudy.repository"
import { CaseStudy } from "@/domain/models/case-study.model"
import { mockCaseStudyRepository } from "../__mocks__/caseStudyRepository.mock"
import { ICaseStudyRepository } from "../interfaces/caseStudyRepository.interface"

const caseStudyRepository = new CaseStudyRepository()



export class CaseStudyService {
  private caseStudyRepository: ICaseStudyRepository

  constructor() {
    if(process.env.MOCK_REPOSITORIES === 'true') {
      this.caseStudyRepository = mockCaseStudyRepository
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
}

// export singleton
export const caseStudyService = new CaseStudyService()