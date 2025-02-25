import { IBannerRepository } from '@/lib/interfaces/bannersRepository.interface';
import { Banner } from '@/domain/models/banner.model';
import { BannerDTO } from '../../infrastructure/dto/banner.dto'; // Assuming you have a BannerDTO
import { BannerMapper } from '../../infrastructure/mappers/banner.mapper'; // Assuming you have a BannerMapper
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { supabase } from '../supabase'
export class BannerRepository implements IBannerRepository {
    private supabaseClient: SupabaseClient<Database>;
    private tableName: string;

    constructor() {
        this.supabaseClient = supabase;
        this.tableName = `zirospace_banners`;
    }
    private getTableName(locale: string): string {
        return `${this.tableName}_${locale}`;
    }


    async getActiveBanner(locale: string): Promise<Banner | null> {
        const tableName = this.getTableName(locale);
        const { data, error } = await this.supabaseClient
            .from(tableName)
            .select('*')
            .eq('is_active', true)
            .lte('start_date', new Date().toISOString())
            .gte('end_date', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) {
            console.error(`Error fetching active banner for locale ${locale}`, error);
            throw new Error(`Failed to fetch active banner for locale ${locale}`);
        }

        if (!data || data.length === 0) {
            return null;
        }

        return BannerMapper.toDomain(data[0]);
    }

    async getBanners(locale: string): Promise<Banner[]> {
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

    async getBannerById(id: string, locale: string): Promise<Banner | null> {
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

    async createBanner(banner: Partial<BannerDTO>, locale: string): Promise<Banner> {
        const tableName = this.getTableName(locale);

        const { data, error } = await this.supabaseClient
            .from(tableName)
            .insert([banner])
            .select('*')
            .single();

        if (error) {
            // TODO: Implement proper error handling
            console.error(`Error creating banner for locale ${locale}`, error);
            throw new Error(`Failed to create banner for locale ${locale}`);
        }

        return BannerMapper.toDomain(data);
    }

    async updateBanner(id: string, banner: Partial<BannerDTO>, locale: string): Promise<Banner> {
        const tableName = this.getTableName(locale);

        const { data, error } = await this.supabaseClient
            .from(tableName)
            .update(banner)
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

    async deleteBanner(id: string, locale: string): Promise<void> {
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

export const bannerRepository = new BannerRepository();