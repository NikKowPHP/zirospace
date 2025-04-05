import { CaseStudySlider } from "@/domain/models/case-study-slider.model"
import { caseStudySliderRepository, ICaseStudySliderRepository } from "../repositories/caseStudySlider.repository"




export class CaseStudySliderService {
  private caseStudySliderRepository: ICaseStudySliderRepository
  constructor() {
    this.caseStudySliderRepository = caseStudySliderRepository
  }

  getCaseStudySliders = async (): Promise<CaseStudySlider[]> => {
    return this.caseStudySliderRepository.getCaseStudiesSliders()
  }

  createCaseStudySlider = async (caseStudySlider: CaseStudySlider ): Promise<CaseStudySlider> => {
    return this.caseStudySliderRepository.createCaseStudySlider(caseStudySlider )
  }

  updateCaseStudySlider = async (id: string, caseStudySlider: CaseStudySlider): Promise<CaseStudySlider | null> => {
    return this.caseStudySliderRepository.updateCaseStudySlider(id, caseStudySlider)
  }

  deleteCaseStudySlider = async (id: string): Promise<void> => {
    return this.caseStudySliderRepository.deleteCaseStudySlider(id)
  }
}

// export singleton
export const caseStudySliderService = new CaseStudySliderService()
