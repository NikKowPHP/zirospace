import { Banner } from '@/domain/models/banner.model';
import { BannerDTO } from '@/infrastructure/dto/banner.dto';

export class BannerMapper {
    static toDomain(dto: BannerDTO): Banner {
        return {
            id: dto.id,
            title: dto.title,
            content: dto.content,
            subtitle: dto.subtitle,
            startDate: dto.start_date ? new Date(dto.start_date) : undefined,
            endDate: dto.end_date ? new Date(dto.end_date) : undefined,
            isActive: dto.is_active,
            createdAt: new Date(dto.created_at),
            updatedAt: new Date(dto.updated_at),
        };
    }

    static toPersistence(domain: Partial<Banner>): Partial<BannerDTO> {
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
    }
}