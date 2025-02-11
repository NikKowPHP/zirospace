import { CaseStudy } from '@/domain/models/case-study.model';
import { CaseStudyDTO } from '../dto/case-study.dto';

export class CaseStudyMapper {
  static toDomain(dto: CaseStudyDTO): CaseStudy {
    // Parse images if they are stored as a JSON string
    const images =
      typeof dto.images === 'string'
        ? JSON.parse(dto.images)
        : dto.images;

    // Optionally, handle the tags field if necessary:
    const tags =
      typeof dto.tags === 'string'
        ? (dto.tags as string).split(',').map((tag: string) => tag.trim())
        : dto.tags ? [...dto.tags] : [];

    return {
      id: dto.id,
      title: dto.title,
      subtitle: dto.subtitle,
      description: dto.description,
      slug: dto.slug,
      tags,
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
    const id = domain.id || (domain.title
      ? domain.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + '-' + Date.now()
      : undefined);

    const isDevelopment = process.env.NODE_ENV === 'development';

    return {
      id,
      slug: domain.slug,
      title: domain.title,
      subtitle: domain.subtitle,
      description: domain.description,
      // Ensure tags are persisted in the desired format
      tags: domain.tags
        ? isDevelopment
          ? (domain.tags.join(',') as any)
          : [...domain.tags]
        : undefined,
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