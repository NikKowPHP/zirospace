import { CaseStudy } from '@/domain/models/case-study.model';
import { CaseStudyDTO } from '../dto/case-study.dto';

export class CaseStudyMapper {
  static toDomain(dto: CaseStudyDTO): CaseStudy {
    return {
      id: dto.id,
      title: dto.title,
      subtitle: dto.subtitle,
      description: dto.description,
      slug: dto.slug,
      tags: [...dto.tags],
      images: dto.images.map(image => ({
        url: image.url,
        alt: image.alt,
      })),
      ctaText: dto.cta_text,
      ctaTextName: 'caseStudy.ctaText.viewCaseStudy',
      ctaUrl: dto.cta_url,
      color: dto.color,
      backgroundColor: dto.background_color,
      theme: dto.theme,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toPersistence(domain: Partial<CaseStudy>): Partial<CaseStudyDTO> {
    const id = domain.id || (domain.title ? 
      domain.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        + '-' + Date.now()
      : undefined)

    return {
      id,
      slug: domain.slug,
      title: domain.title,
      subtitle: domain.subtitle,
      description: domain.description,
      tags: domain.tags ? [...domain.tags] : undefined,
      images: domain.images?.map(image => ({
        url: image.url,
        alt: image.alt,
      })),
      cta_text: domain.ctaText,
      cta_text_name: domain.ctaTextName,
      cta_url: domain.ctaUrl,
      color: domain.color,
      background_color: domain.backgroundColor,
      theme: domain.theme,
    }
  }
} 