import { Locale } from "@/i18n"
import { CaseStudyRepository, caseStudyRepository, ICaseStudyRepository, CaseStudyImageCreateInput, CaseStudyCreateInput, CaseStudyUpdateInput } from "../repositories/caseStudy.repository"
import { CaseStudy } from "@/domain/models/models"

export interface OrderUpdate {
  id: string
  order: number
}




export class CaseStudyService {
  private caseStudyRepository: ICaseStudyRepository
  constructor() {
    this.caseStudyRepository = caseStudyRepository
  }

  getCaseStudies = async (locale: Locale): Promise<CaseStudy[]> => {
    return this.caseStudyRepository.getCaseStudies(locale)
  }

  getCaseStudyBySlug = async (slug: string, locale: Locale): Promise<CaseStudy | null> => {
    return this.caseStudyRepository.getCaseStudyBySlug(slug, locale)
  }

  // Use the correct input type from the repository and handle potentiacl null return
  createCaseStudy = async (caseStudyData: CaseStudyCreateInput, locale: Locale): Promise<CaseStudy> => {
    // The repository now expects CaseStudyCreateInput, which has required fields.
    // The null check for the input object itself might be less critical,
    // but checking the result from the repository is important.
    // if(!caseStudyData) throw new Error('Case study data is not provided'); // Consider if this check is still needed based on usage

    const createdCaseStudy = await this.caseStudyRepository.createCaseStudy(caseStudyData, locale);
    if (!createdCaseStudy) {
      // Throw an error if the repository failed to create the study
      throw new Error('Failed to create case study.');
    }
    return createdCaseStudy; // Now guaranteed to be CaseStudy, not null
  }

  // Handle potential null return from the repository
  updateCaseStudy = async (id: string, caseStudy: CaseStudyUpdateInput, locale: Locale): Promise<CaseStudy> => {
    const updatedCaseStudy = await this.caseStudyRepository.updateCaseStudy(id, caseStudy, locale);
    if (!updatedCaseStudy) {
      // Throw an error if the repository failed to update (e.g., not found)
      throw new Error(`Failed to update case study with ID ${id}.`);
    }
    return updatedCaseStudy; // Now guaranteed to be CaseStudy, not null
  }

  // Change return type to boolean to match repository
  deleteCaseStudy = async (id: string, locale: Locale): Promise<boolean> => {
    const success = await this.caseStudyRepository.deleteCaseStudy(id, locale);
    // Optionally, throw an error here if success is false, depending on desired service behavior
    // if (!success) {
    //   throw new Error(`Failed to delete case study with ID ${id}.`);
    // }
    return success;
  }

  updateCaseStudyOrder = async (orders: OrderUpdate[], locale: Locale): Promise<void> => {
    return this.caseStudyRepository.updateCaseStudyOrder(orders, locale)
  }

  getCaseStudyById = async (id: string, locale: Locale) => {

    return this.caseStudyRepository.getCaseStudyById(id, locale);

  }






}

// export singleton
export const caseStudyService = new CaseStudyService()

export const getCaseStudyService = async () => {
  return new CaseStudyService()
}
