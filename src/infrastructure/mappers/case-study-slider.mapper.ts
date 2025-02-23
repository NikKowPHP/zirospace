import { CaseStudyImage, CaseStudySlider } from '@/domain/models/case-study-slider.model';
import { CaseStudySliderDTO, CaseStudySliderImageDTO } from '../dto/case-study-slider.dto';

export class CaseStudySliderMapper {
  static toDomain(dto: CaseStudySliderDTO): CaseStudySlider {
    const images = dto.images
      ? typeof dto.images === 'string'
        ? JSON.parse(dto.images)
        : dto.images
      : [];

    console.log('images in mapper', images)

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

    const updatedAt = new Date(domain.updatedAt ?? new Date())
    const createdAt = new Date(domain.createdAt ?? new Date())
    return {
      id: domain.id,
      // images: domain.images?.map(image => ({
      //   id: image.id,
      //   image: image.image,
      //   alt: image.alt,
      // })),
      updated_at: updatedAt.toISOString(),
      created_at: createdAt.toISOString(),
    }
  }
} 


export class CaseStudySliderImagesMapper {
  static toDomain(dto: CaseStudySliderImageDTO): CaseStudyImage {
    return {
      id: dto.id,
      image: dto.image,
      alt: dto.alt,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    }
  }

  static toPersistence(domain: Partial<CaseStudyImage>): Partial<CaseStudySliderImageDTO> {
    return {
      id: domain.id,
      image: domain.image,
      alt: domain.alt,
    }
  }
}