import { Service } from "@/domain/models/service.model";
import { ServiceDTO } from "../dto/service.dto";

export class ServiceMapper {
  static toDomain(dto: ServiceDTO): Service {
    return {
      id: dto.id,
      slug: dto.slug,
      title: dto.title,
      subtitle: dto.subtitle,
      contentHtml: dto.content_html,
      excerpt: dto.excerpt,
      imageUrl: dto.image_url,
      imageAlt: dto.image_alt,
      metaTitle: dto.meta_title,
      metaDescription: dto.meta_description,
      keywords: dto.keywords,
      isPublished: dto.is_published,
      orderIndex: dto.order_index,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }

  static toPersistence(domain: Partial<Service>): Partial<ServiceDTO> {
    return {
      id: domain.id,
      slug: domain.slug,
      title: domain.title,
      subtitle: domain.subtitle,
      content_html: domain.contentHtml,
      excerpt: domain.excerpt,
      image_url: domain.imageUrl,
      image_alt: domain.imageAlt,
      meta_title: domain.metaTitle,
      meta_description: domain.metaDescription,
      keywords: domain.keywords,
      is_published: domain.isPublished,
      order_index: domain.orderIndex,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }
}