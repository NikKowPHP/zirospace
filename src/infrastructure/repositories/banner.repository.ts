import { IBannerRepository } from '@/lib/interfaces/bannersRepository.interface';
import { Locale } from '@/i18n';
import { Banner } from '@/domain/models/banner.model';
import { BannerDTO } from '../dto/banner.dto'; // Assuming you have a BannerDTO
import { BannerMapper } from '../mappers/banner.mapper'; // Assuming you have a BannerMapper
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export class BannerRepository implements IBannerRepository {
    private supabaseClient: SupabaseClient<Database>;
    private tableName: string;

    constructor(supabaseClient: SupabaseClient<Database>) {
        this.supabaseClient = supabaseClient;
        this.tableName = `zirospace_banners`;
    }
    private getTableName(locale: Locale): string {
        return `${this.tableName}_${locale}`;
    }

    async getBanners(locale: Locale): Promise<Banner[]> {
        const tableName = this.getTableName(locale);
        const { data, error } = await this.supabaseClient
            .from(tableName)
            .select('*');

        if (error) {
            // TODO: Implement proper error handling
            console.error(`Error fetching banners for locale ${locale}`, error);
            throw new Error(`Failed to fetch banners for locale ${locale}`);
        }

        return data.map(BannerMapper.toDomain);
    }

    async getBannerById(id: string, locale: Locale): Promise<Banner | null> {
        const tableName = this.getTableName(locale);
        const { data, error } = await this.supabaseClient
            .from(tableName)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.message === 'No rows found') {
                return null; // Banner not found, return null
            }
            // TODO: Implement proper error handling
            console.error(`Error fetching banner by ID ${id} for locale ${locale}`, error);
            throw new Error(`Failed to fetch banner by ID ${id} for locale ${locale}`);
        }

        return BannerMapper.toDomain(data);
    }

    async createBanner(banner: Partial<Banner>, locale: Locale): Promise<Banner> {
        const tableName = this.getTableName(locale);
        const bannerDTO: Partial<BannerDTO> = BannerMapper.toPersistence(banner);

        const { data, error } = await this.supabaseClient
            .from(tableName)
            .insert([bannerDTO])
            .select('*')
            .single();

        if (error) {
            // TODO: Implement proper error handling
            console.error(`Error creating banner for locale ${locale}`, error);
            throw new Error(`Failed to create banner for locale ${locale}`);
        }

        return BannerMapper.toDomain(data);
    }

    async updateBanner(id: string, banner: Partial<Banner>, locale: Locale): Promise<Banner> {
        const tableName = this.getTableName(locale);
        const bannerDTO: Partial<BannerDTO> = BannerMapper.toPersistence(banner);

        const { data, error } = await this.supabaseClient
            .from(tableName)
            .update(bannerDTO)
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            // TODO: Implement proper error handling
            console.error(`Error updating banner ${id} for locale ${locale}`, error);
            throw new Error(`Failed to update banner ${id} for locale ${locale}`);
        }

        return BannerMapper.toDomain(data);
    }

    async deleteBanner(id: string, locale: Locale): Promise<void> {
        const tableName = this.getTableName(locale);
        const { error } = await this.supabaseClient
            .from(tableName)
            .delete()
            .eq('id', id);

        if (error) {
            // TODO: Implement proper error handling
            console.error(`Error deleting banner ${id} for locale ${locale}`, error);
            throw new Error(`Failed to delete banner ${id} for locale ${locale}`);
        }
    }
} 