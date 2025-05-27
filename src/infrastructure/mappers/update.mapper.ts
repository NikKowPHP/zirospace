import { Update } from "@/domain/models/update.model";
import { UpdateDTO } from "../dto/update.dto";

export class UpdateMapper {
  static toDomain(updateDTO: UpdateDTO): Update {
    return {
      id: updateDTO.id,
      slug: updateDTO.slug,
      title: updateDTO.title,
      publish_date: new Date(updateDTO.publish_date),
      content_html: updateDTO.content_html,
      excerpt: updateDTO.excerpt,
      image_url: updateDTO.image_url,
      image_alt: updateDTO.image_alt,
      is_published: updateDTO.is_published,
      order_index: updateDTO.order_index,
      created_at: new Date(updateDTO.created_at),
      updated_at: new Date(updateDTO.updated_at),
    };
  }

  static toPersistence(update: Update): UpdateDTO {
    return {
      id: update.id,
      slug: update.slug,
      title: update.title,
      publish_date: update.publish_date.toISOString(),
      content_html: update.content_html,
      excerpt: update.excerpt,
      image_url: update.image_url,
      image_alt: update.image_alt,
      is_published: update.is_published,
      order_index: update.order_index,
      created_at: update.created_at.toISOString(),
      updated_at: update.updated_at.toISOString(),
    };
  }
}