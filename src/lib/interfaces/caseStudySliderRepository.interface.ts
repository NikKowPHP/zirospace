import { CaseStudySlider } from "@/domain/models/case-study-slider.model"
import { Locale } from "@/i18n";

export interface ICaseStudySliderRepository {
  getCaseStudiesSliders: (locale: string) => Promise<CaseStudySlider[]>
  createCaseStudySlider: (caseStudySlider: CaseStudySlider, locale: string) => Promise<CaseStudySlider>
  updateCaseStudySlider: (id: string, caseStudySlider: Partial<CaseStudySlider>, locale: string) => Promise<CaseStudySlider | null>
  deleteCaseStudySlider: (id: string, locale: string) => Promise<void>
}