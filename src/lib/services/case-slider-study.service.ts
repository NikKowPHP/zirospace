import { Locale } from "@/i18n"
import { CaseStudyRepository } from "../repositories/caseStudy.repository"
import { CaseStudy } from "@/domain/models/case-study.model"
// import { mockCaseStudyRepository } from "../__mocks__/caseStudyRepository.mock"
import { caseStudyRepositoryLocal } from "../repositories/caseStudy.local.repository"
import { ICaseStudyRepository } from "../interfaces/caseStudyRepository.interface"
import { CaseStudySlider } from "@/domain/models/case-study-slider.model"
import { ICaseStudySliderRepository } from "../interfaces/caseStudySliderRepository.interface"
import { mockCaseStudySliderRepository } from "../__mocks__/caseStudySliderRepository.mock"
import { caseStudySliderRepository } from "../repositories/caseStudySlider.repository"

const caseStudyRepository = new CaseStudyRepository()



export class CaseStudyService {
  private caseStudyRepository: ICaseStudyRepository
  private caseStudySliderRepository: ICaseStudySliderRepository
  constructor() {
    if(process.env.MOCK_REPOSITORIES === 'true') {
      this.caseStudyRepository = caseStudyRepositoryLocal
      this.caseStudySliderRepository = mockCaseStudySliderRepository
    } else {
      this.caseStudyRepository = caseStudyRepository
      this.caseStudySliderRepository = caseStudySliderRepository
    }
  }

  getCaseStudies = async (locale: Locale): Promise<CaseStudy[]> => {
    return this.caseStudyRepository.getCaseStudies(locale)
  }

  getCaseStudyBySlug = async (slug: string, locale: Locale): Promise<CaseStudy | null> => {
    return this.caseStudyRepository.getCaseStudyBySlug(slug, locale)
  }

  getCaseStudiesSliders = async (): Promise<CaseStudySlider[]> => {
    return this.caseStudySliderRepository.getCaseStudiesSliders()
  }
}

// export singleton
export const caseStudyService = new CaseStudyService()
