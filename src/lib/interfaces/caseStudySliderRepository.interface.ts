import { CaseStudySlider } from "@/domain/models/case-study-slider.model"

export interface ICaseStudySliderRepository {
  getCaseStudiesSliders: () => Promise<CaseStudySlider[]>
}