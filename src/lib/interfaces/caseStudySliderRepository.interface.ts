import { CaseStudySlider } from "@/domain/models/case-study-slider.model"

export interface ICaseStudySliderRepository {
  getCaseStudiesSliders: () => Promise<CaseStudySlider[]>
  createCaseStudySlider: (caseStudySlider: CaseStudySlider) => Promise<CaseStudySlider>
  updateCaseStudySlider: (id: string, caseStudySlider: Partial<CaseStudySlider>) => Promise<CaseStudySlider | null>
  deleteCaseStudySlider: (id: string) => Promise<void>
}