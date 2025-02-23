import { Banner } from '@/domain/models/banner.model';
import { BannerDTO } from '@/infrastructure/dto/banner.dto';
import logger from '@/lib/logger'

export class BannerMapper {
    static toDomain(dto: BannerDTO): Banner {
        console.log('dto', dto)
        try {
            return {
                id: dto.id,
                title: dto.title,
                content: dto.content,
                subtitle: dto.subtitle,
                imageUrl: dto.image_url,
                startDate: dto.start_date ? new Date(dto.start_date) : undefined,
                endDate: dto.end_date ? new Date(dto.end_date) : undefined,
                isActive: dto.is_active,
                createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
                updatedAt: dto.updated_at ? new Date(dto.updated_at) : new Date(),
                ctaButtonText: dto.cta_button_text,
                ctaButtonLink: dto.cta_button_link,
            };
        } catch (error) {
            logger.error('Error mapping BannerDTO to Domain:', error);
            throw new Error('Failed to map Banner DTO to Domain');
        }
    }

    static toPersistence(domain: Partial<Banner>): Partial<BannerDTO> {
        try {
            return {
                id: domain.id,
                title: domain.title,
                content: domain.content,
                subtitle: domain.subtitle ?? null,
                image_url: domain.imageUrl ?? null,
                start_date: domain.startDate instanceof Date ? domain.startDate.toISOString() : null,
                end_date: domain.endDate instanceof Date ? domain.endDate.toISOString() : null,
                is_active: domain.isActive ?? false,
                created_at: domain.createdAt?.toISOString() ?? null,
                updated_at: domain.updatedAt?.toISOString() ?? null,
                cta_button_text: domain.ctaButtonText ?? null,
                cta_button_link: domain.ctaButtonLink ?? null,
            };
        } catch (error) {
            logger.error('Error mapping Banner to DTO:', error);
            throw new Error('Failed to map Banner to DTO');
        }
    }
}