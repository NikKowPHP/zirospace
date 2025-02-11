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

  static toPersistence(domain: Partial<Testimonial>): Partial<TestimonialDTO> {
    const dto: Partial<TestimonialDTO> = {
      ...(domain.id && { id: domain.id }),
      ...(domain.author && { author: domain.author }),
      ...(domain.role && { role: domain.role }),
      ...(domain.company && { company: domain.company }),
      ...(domain.quote && { quote: domain.quote }),
      ...(domain.image && { image: domain.image }),
      ...(domain.image_alt && { image_alt: domain.image_alt }),
    };

    // Only add timestamps if they exist and are valid
    if (domain.createdAt) {
      try {
        dto.created_at = new Date(domain.createdAt).toISOString();
      } catch (error) {
        console.warn('Invalid createdAt date, using current date');
        dto.created_at = new Date().toISOString();
      }
    }

    if (domain.updatedAt) {
      try {
        dto.updated_at = new Date(domain.updatedAt).toISOString();
      } catch (error) {
        console.warn('Invalid updatedAt date, using current date');
        dto.updated_at = new Date().toISOString();
      }
    } else {
      // Always set updated_at on updates
      dto.updated_at = new Date().toISOString();
    }

    return dto;
  }
}