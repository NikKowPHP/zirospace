import { CaseStudy } from '@/domain/models/case-study.model';
import { CaseStudyDTO } from '../dto/case-study.dto';
import logger from '@/lib/logger'
export class CaseStudyMapper {
  static toDomain(dto: CaseStudyDTO): CaseStudy {
    // Parse images if they are stored as a JSON string
    let images = dto.images;

    if (typeof dto.images === 'string') {
      try {
        images = JSON.parse(dto.images);
      } catch (error) {
        logger.log("Error parsing images JSON:", error);
        images = []; // or handle the error as needed
      }
    }

    // If images is still not an array, default to an empty array
    if (!Array.isArray(images)) {
      images = [];
    }

    // Optionally, handle the tags field if necessary:
    const tags =
      typeof dto.tags === 'string'
        ? (dto.tags as string).split(',').map((tag: string) => tag.trim())
        : dto.tags ? [...dto.tags] : [];
    logger.log('tags' , dto.tags);

    return {
      id: dto.id,
      title: dto.title,
      subtitle: dto.subtitle,
      description: dto.description,
      slug: dto.slug,
      tags:tags,
      images: images.map((image: { url: string; alt: string }) => ({
        url: image.url,
        alt: image.alt,
      })),
      ctaUrl: dto.cta_url,
      color: dto.color,
      backgroundColor: dto.background_color,
      theme: dto.theme,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toPersistence(domain: Partial<CaseStudy>): Partial<CaseStudyDTO> {
  
    console.log('domain in toPersistence', domain)
    const isDevelopment = process.env.NODE_ENV === 'development';
    logger.log('domain tags to proceed', domain.tags);
    const tags = domain.tags ? [...domain.tags] : [];


    return {
      id: domain.id,
      slug: domain.slug,
      title: domain.title,
      subtitle: domain.subtitle,
      description: domain.description,
      // Ensure tags are persisted in the desired format - now always an array
      tags: tags,
      // Convert images array to JSON string if needed before persistence
      images: domain.images
        ? isDevelopment
          ? (JSON.stringify(domain.images) as any)
          : domain.images.map(image => ({
            url: image.url,
            alt: image.alt,
          }))
        : undefined,
      cta_url: domain.ctaUrl,
      color: domain.color,
      background_color: domain.backgroundColor,
      theme: domain.theme,
    };
  }
} 