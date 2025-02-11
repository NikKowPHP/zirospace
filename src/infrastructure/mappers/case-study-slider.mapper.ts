import { CaseStudySlider } from '@/domain/models/case-study-slider.model';
import { CaseStudySliderDTO } from '../dto/case-study-slider.dto';

export class CaseStudySliderMapper {
  static toDomain(dto: CaseStudySliderDTO): CaseStudySlider {
    const images = dto.images
      ? typeof dto.images === 'string'
        ? JSON.parse(dto.images)
        : dto.images
      : [];

    return {
      id: dto.id,
      images: images.map((image: { id: string; image: string; alt: string; }) => ({
        id: image.id,
        image: image.image,
        alt: image.alt,
      })),
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toPersistence(domain: Partial<CaseStudySlider>): Partial<CaseStudySliderDTO> {
    return {
      id: domain.id,
      images: domain.images?.map(image => ({
        id: image.id,
        image: image.image,
        alt: image.alt,
      })),
      updated_at: domain.updatedAt?.toISOString(),
    }
  }
} 