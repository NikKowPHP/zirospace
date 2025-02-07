import { CaseStudySlider } from "@/domain/models/case-study-slider.model"
import { ICaseStudySliderRepository } from "../interfaces/caseStudySliderRepository.interface"
import { caseStudySliderRepository } from "../repositories/caseStudySlider.repository"
import { caseStudySliderRepositoryLocal } from "../repositories/caseStudySlider.local.repository"




export class CaseStudySliderService {
  private caseStudySliderRepository: ICaseStudySliderRepository
  constructor() {
    if(process.env.MOCK_REPOSITORIES === 'true') {
      this.caseStudySliderRepository = caseStudySliderRepositoryLocal
    } else {
      this.caseStudySliderRepository = caseStudySliderRepository
    }
  }

  getCaseStudySliders = async (locale: string): Promise<CaseStudySlider[]> => {
    return this.caseStudySliderRepository.getCaseStudiesSliders(locale)
  }

  createCaseStudySlider = async (caseStudySlider: CaseStudySlider, locale: string): Promise<CaseStudySlider> => {
    return this.caseStudySliderRepository.createCaseStudySlider(caseStudySlider, locale)
  }

  updateCaseStudySlider = async (id: string, caseStudySlider: CaseStudySlider, locale: string): Promise<CaseStudySlider | null> => {
    return this.caseStudySliderRepository.updateCaseStudySlider(id, caseStudySlider, locale)
  }

  deleteCaseStudySlider = async (id: string, locale: string): Promise<void> => {
    return this.caseStudySliderRepository.deleteCaseStudySlider(id, locale)
  }
}

// export singleton
export const caseStudySliderService = new CaseStudySliderService()
