import { IServiceRepository } from '../interfaces/service.interface';
import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { ServiceMapper } from '../../infrastructure/mappers/service.mapper';
import { supabase } from '@/lib/supabase'; // Change import
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/utils/cache';
import logger from '@/lib/logger';

// const supabase = createClient(); // Remove this line

export class ServiceRepository implements IServiceRepository {
  private getTableName(locale: string): string {
    return `zirospace_services_${locale}`;
  }

  async getServices(locale: string): Promise<Service[]> {
    const tableName = this.getTableName(locale);
    const { data, error } = await unstable_cache(
      async () => {
        logger.info(`Fetching services for locale: ${locale}`);
        return supabase.from(tableName).select('*');
      },
      [`services-${locale}`],
      {
        tags: [CACHE_TAGS.SERVICES, `${CACHE_TAGS.SERVICES}-${locale}`],
      }
    )();

    if (error) {
      logger.error(`Error fetching services from Supabase for locale ${locale}:`, error);
      throw new Error(`Failed to fetch services: ${error.message}`);
    }

    return data.map(ServiceMapper.toDomain);
  }

  async getServiceBySlug(slug: string, locale: string): Promise<Service | null> {
    const tableName = this.getTableName(locale);
    const { data, error } = await unstable_cache(
      async () => {
        logger.info(`Fetching service by slug "${slug}" for locale: ${locale}`);
        return supabase.from(tableName).select('*').eq('slug', slug).single();
      },
      [`service-${locale}-${slug}`],
      {
        tags: [CACHE_TAGS.SERVICES, `${CACHE_TAGS.SERVICES}-${locale}`, `${CACHE_TAGS.SERVICES}-${locale}-${slug}`],
      }
    )();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return null;
      }
      logger.error(`Error fetching service by slug "${slug}" from Supabase for locale ${locale}:`, error);
      throw new Error(`Failed to fetch service by slug: ${error.message}`);
    }

    return data ? ServiceMapper.toDomain(data as ServiceDTO) : null;
  }

  async getServiceById(id: string, locale: string): Promise<Service | null> {
    const tableName = this.getTableName(locale);
    // No caching for get by ID as it's likely used in admin or specific cases
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return null;
      }
      logger.error(`Error fetching service by id "${id}" from Supabase for locale ${locale}:`, error);
      throw new Error(`Failed to fetch service by id: ${error.message}`);
    }

    return data ? ServiceMapper.toDomain(data as ServiceDTO) : null;
  }

  async createService(service: Partial<ServiceDTO>, locale: string): Promise<Service> {
    const tableName = this.getTableName(locale);
    // Supabase handles created_at and updated_at with default values
    const { data, error } = await supabase
      .from(tableName)
      .insert(service)
      .select()
      .single();

    if (error) {
      logger.error(`Error creating service in Supabase for locale ${locale}:`, error);
      throw new Error(`Failed to create service: ${error.message}`);
    }

    // Revalidate cache tags after creation
    // This will be handled in the API route that calls this method

    return ServiceMapper.toDomain(data as ServiceDTO);
  }

  async updateService(id: string, service: Partial<ServiceDTO>, locale: string): Promise<Service | null> {
    const tableName = this.getTableName(locale);
    // Supabase handles updated_at with default values
    const { data, error } = await supabase
      .from(tableName)
      .update(service)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found to update
        return null;
      }
      logger.error(`Error updating service with id "${id}" in Supabase for locale ${locale}:`, error);
      throw new Error(`Failed to update service: ${error.message}`);
    }

    // Revalidate cache tags after update
    // This will be handled in the API route that calls this method

    return data ? ServiceMapper.toDomain(data as ServiceDTO) : null;
  }

  async deleteService(id: string, locale: string): Promise<boolean> {
    const tableName = this.getTableName(locale);
    const { error, count } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
      .select(); // Use select to get count of affected rows

    if (error) {
      logger.error(`Error deleting service with id "${id}" from Supabase for locale ${locale}:`, error);
      throw new Error(`Failed to delete service: ${error.message}`);
    }

    // Revalidate cache tags after deletion
    // This will be handled in the API route that calls this method

    return count !== null && count > 0;
  }
}

// export singleton
export const serviceRepository = new ServiceRepository();