import { PrismaClient } from '@prisma/client';
import { IBannerRepository } from '@/lib/interfaces/bannersRepository.interface';
import { Banner } from '@/domain/models/banner.model';
import { BannerDTO } from '../../infrastructure/dto/banner.dto';
import { BannerMapper } from '../../infrastructure/mappers/banner.mapper';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';


export class BannerRepository implements IBannerRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async getActiveBanner(locale: string): Promise<Banner | null> {
        try {
            const banner = await this.prisma.banner.findFirst({
                where: {
                    locale,
                    isActive: true,
                    startDate: { lte: new Date() },
                    endDate: { gte: new Date() },
                },
                orderBy: { createdAt: 'desc' },
            });

            if (!banner) return null;
            return BannerMapper.toDomain(banner);
        } catch (error) {
            logger.log(`Error fetching active banner for locale ${locale}`, error);
            throw new Error(`Failed to fetch active banner for locale ${locale}`);
        }
    }

    async getBanners(locale: string): Promise<Banner[]> {
        try {
            const banners = await this.prisma.banner.findMany({
                where: { locale },
            });

            return banners.map(BannerMapper.toDomain);
        } catch (error) {
            logger.log(`Error fetching banners for locale ${locale}`, error);
            throw new Error(`Failed to fetch banners for locale ${locale}`);
        }
    }

    async getBannerById(id: string, locale: string): Promise<Banner | null> {
        try {
            const banner = await this.prisma.banner.findFirst({
                where: { id, locale },
            });

            if (!banner) return null;
            return BannerMapper.toDomain(banner);
        } catch (error) {
            logger.log(`Error fetching banner by ID ${id} for locale ${locale}`, error);
            throw new Error(`Failed to fetch banner by ID ${id} for locale ${locale}`);
        }
    }

    async createBanner(banner: Partial<BannerDTO>, locale: string): Promise<Banner> {
        try {
            const createdBanner = await this.prisma.banner.create({
                data: { ...banner, locale },
            });

            return BannerMapper.toDomain(createdBanner);
        } catch (error) {
            logger.log(`Error creating banner for locale ${locale}`, error);
            throw new Error(`Failed to create banner for locale ${locale}`);
        }
    }

    async updateBanner(id: string, banner: Partial<BannerDTO>, locale: string): Promise<Banner> {
        try {
            const updatedBanner = await this.prisma.banner.update({
                where: { id },
                data: banner,
            });

            return BannerMapper.toDomain(updatedBanner);
        } catch (error) {
            logger.log(`Error updating banner ${id} for locale ${locale}`, error);
            throw new Error(`Failed to update banner ${id} for locale ${locale}`);
        }
    }

    async deleteBanner(id: string, locale: string): Promise<void> {
        try {
            await this.prisma.banner.delete({
                where: { id },
            });
        } catch (error) {
            logger.log(`Error deleting banner ${id} for locale ${locale}`, error);
            throw new Error(`Failed to delete banner ${id} for locale ${locale}`);
        }
    }
}

export const bannerRepository = new BannerRepository(prisma);


