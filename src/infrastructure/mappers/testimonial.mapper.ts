import { TestimonialDTO } from '../dto/testimonial.dto';
import { Testimonial } from '../../domain/models/testimonial.model';

export class TestimonialMapper {
  static toDomain(dto: TestimonialDTO): Testimonial {
    return {
      id: dto.id,
      author: dto.author,
      role: dto.role,
      company: dto.company,
      quote: dto.quote,
      image: dto.image,
      image_alt: dto.image_alt,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toPersistence(domain: Testimonial): TestimonialDTO {
    return {
      id: domain.id,
      author: domain.author,
      role: domain.role,
      company: domain.company,
      quote: domain.quote,
      image: domain.image,
      image_alt: domain.image_alt,
      created_at: domain.createdAt.toISOString(),
      updated_at: domain.updatedAt.toISOString(),
    };
  }
}