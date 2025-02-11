import { BlogPost } from '@/domain/models/blog-post.model';
import { BlogPostDTO } from '../dto/blog-post.dto';

export class BlogPostMapper {
  static toDomain(dto: BlogPostDTO): BlogPost {
    return {
      id: dto.id,
      slug: dto.slug,
      title: dto.title,
      imageurl: dto.image_url,
      createdAt: dto.created_at,
      imageAlt: dto.image_alt,
      excerpt: dto.excerpt,
      contentHtml: dto.content_html,
      isPinned: Boolean(dto.is_pinned),
    };
  }

  static toPersistence(domain: BlogPost): BlogPostDTO {
    return {
      id: domain.id,
      slug: domain.slug,
      title: domain.title,
      image_url: domain.imageurl,
      created_at: domain.createdAt,
      updated_at: domain.createdAt,
      image_alt: domain.imageAlt,
      excerpt: domain.excerpt,
      content_html: domain.contentHtml,
      is_pinned: Boolean(domain.isPinned), 
    };
  }
}