import { CaseStudySlider } from '@/domain/models/case-study-slider.model';
import { CaseStudySliderDTO } from '../dto/case-study-slider.dto';

export class CaseStudySliderMapper {
  static toDomain(dto: CaseStudySliderDTO): CaseStudySlider {
    return {
      id: dto.id,
   
      images: dto.images.map(image => ({
        url: image.url,
        alt: image.alt,
      })),
     
      theme: dto.theme,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toPersistence(domain: Partial<CaseStudySlider>): Partial<CaseStudySliderDTO> {
    const id = domain.id  ? 
      domain.id.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        + '-' + Date.now()
      : undefined

    return {
      id,
      images: domain.images?.map(image => ({
        url: image.url,
        alt: image.alt,
      })),
      theme: domain.theme,
    }
  }
} 