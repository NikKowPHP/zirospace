import { Banner } from '@/domain/models/banner.model';
import { BannerDTO } from '@/infrastructure/dto/banner.dto';
import logger from '@/lib/logger'

export class BannerMapper {
    static toDomain(dto: BannerDTO): Banner {
        try {
            return {
                id: dto.id,
                title: dto.title,
                content: dto.content,
                subtitle: dto.subtitle,
                imageUrl: dto.image_url,
                youtubeUrl: dto.youtube_url,
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
        const createdAt = domain.createdAt && domain.createdAt instanceof Date ? domain.createdAt.toISOString() : new Date().toISOString()
        const updatedAt = domain.updatedAt && domain.updatedAt instanceof Date ? domain.updatedAt.toISOString() : new Date().toISOString()
        const bannerId = domain.id ? domain.id : crypto.randomUUID()

        const startDate = domain.startDate && domain.startDate instanceof Date ? domain.startDate.toISOString() : domain.startDate
        const endDate = domain.endDate && domain.endDate instanceof Date ? domain.endDate.toISOString() : domain.endDate

        try {
            console.log('domain at to persistence', domain)
            return {
                id: bannerId,
                title: domain.title,
                content: domain.content,
                subtitle: domain.subtitle ?? undefined,
                image_url: domain.imageUrl ?? undefined,
                youtube_url: domain.youtubeUrl ?? undefined,
                start_date: startDate,
                end_date: endDate,
                is_active: domain.isActive ?? false,
                created_at: createdAt,
                updated_at: updatedAt,
                cta_button_text: domain.ctaButtonText ?? undefined,
                cta_button_link: domain.ctaButtonLink ?? undefined,
                
            };
        } catch (error) {
            logger.error('Error mapping Banner to DTO:', error);
            throw new Error('Failed to map Banner to DTO');
        }
    }
}