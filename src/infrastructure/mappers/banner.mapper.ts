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
                startDate: dto.start_date ? new Date(dto.start_date) : undefined,
                endDate: dto.end_date ? new Date(dto.end_date) : undefined,
                isActive: dto.is_active,
                createdAt: dto.created_at ? new Date(dto.created_at) : new Date(),
                updatedAt: dto.updated_at ? new Date(dto.updated_at) : new Date(),
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
                subtitle: domain.subtitle,
                start_date: domain.startDate?.toISOString(),
                end_date: domain.endDate?.toISOString(),
                is_active: domain.isActive,
                created_at: domain.createdAt?.toISOString(),
                updated_at: domain.updatedAt?.toISOString(),
            };
        } catch (error) {
            logger.error('Error mapping Banner to DTO:', error);
            throw new Error('Failed to map Banner to DTO');
        }
    }
}