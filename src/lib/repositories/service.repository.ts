// src/lib/repositories/service.repository.ts
import { IServiceRepository } from '../interfaces/service.interface'
import { Service } from '../../domain/models/service.model'
import { ServiceDTO } from '../../infrastructure/dto/service.dto'
import { ServiceMapper } from '../../infrastructure/mappers/service.mapper'
import { supabase } from '@/lib/supabase'
import logger from '@/lib/logger'
import { unstable_cache } from 'next/cache' // Added import
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache' // Added import

export class ServiceRepository implements IServiceRepository {
  private getTableName(locale: string): string {
    return `zirospace_services_${locale}`
  }

  getServices = unstable_cache(
    // Wrapped with unstable_cache
    async (locale: string): Promise<Service[]> => {
      const tableName = this.getTableName(locale)
      logger.log(
        `Fetching services for locale: ${locale} (WITH unstable_cache)`
      )
      const { data, error } = await supabase.from(tableName).select('*')

      if (error) {
        logger.error(
          `Error fetching services from Supabase for locale ${locale}:`,
          error
        )
        throw new Error(`Failed to fetch services: ${error.message}`)
      }

      return data.map(ServiceMapper.toDomain)
    },
    ['getServices'], // Base key segment for getServices
    {
      tags: [CACHE_TAGS.SERVICES], // Tag for revalidation
      revalidate: CACHE_TIMES.MINUTE,
    }
  )

  getServiceBySlug = async (
    slug: string,
    locale: string
  ): Promise<Service | null> => {
    const cachedGetBySlug = unstable_cache(
      async (slug: string, locale: string): Promise<Service | null> => {
        const tableName = this.getTableName(locale)
        logger.log(
          `Fetching service by slug "${slug}" for locale: ${locale} (WITH unstable_cache)`
        )
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('slug', slug)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows found
            return null
          }
          logger.error(
            `Error fetching service by slug "${slug}" from Supabase for locale ${locale}:`,
            error
          )
          const errorMessage = `Failed to fetch service by slug: ${error.message}${error.details ? ' Details: ' + error.details : ''}`
          throw new Error(errorMessage)
        }
        return data ? ServiceMapper.toDomain(data as ServiceDTO) : null
      },
      [`getServiceBySlug-${slug}-${locale}`], // Dynamic key segment including slug and locale
      {
        tags: [CACHE_TAGS.SERVICES, `service-slug-${slug}-${locale}`], // Specific tag + general tag
        revalidate: CACHE_TIMES.MINUTE,
      }
    )

    return cachedGetBySlug(slug, locale)
  }

  async getServiceById(id: string, locale: string): Promise<Service | null> {
    // It's also a good idea to cache this if it might be called from Server Components
    return unstable_cache(
      async () => {
        const tableName = this.getTableName(locale)
        logger.log(
          `Fetching service by id "${id}" for locale: ${locale} (WITH unstable_cache)`
        )
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            return null
          }
          logger.error(
            `Error fetching service by id "${id}" from Supabase for locale ${locale}:`,
            error
          )
          throw new Error(`Failed to fetch service by id: ${error.message}`)
        }
        return data ? ServiceMapper.toDomain(data as ServiceDTO) : null
      },
      [`getServiceById-${id}-${locale}`], // Dynamic key segment
      {
        tags: [CACHE_TAGS.SERVICES, `service-id-${id}-${locale}`],
        revalidate: CACHE_TIMES.MINUTE,
      }
    )()
  }

  async createService(
    service: Partial<ServiceDTO>,
    locale: string
  ): Promise<Service> {
    const tableName = this.getTableName(locale)
    const { data, error } = await supabase
      .from(tableName)
      .insert(service)
      .select()
      .single()

    if (error) {
      logger.error(
        `Error creating service in Supabase for locale ${locale}:`,
        error
      )
      throw new Error(`Failed to create service: ${error.message}`)
    }
    // Note: revalidateTag will be called in the API route, not here directly.
    return ServiceMapper.toDomain(data as ServiceDTO)
  }

  async updateService(
    id: string,
    service: Partial<ServiceDTO>,
    locale: string
  ): Promise<Service | null> {
    const tableName = this.getTableName(locale)
    logger.log(
      `ServiceRepository.updateService: updating table ${tableName} with id ${id}, data: ${JSON.stringify(service)}`
    )
    const { data, error } = await supabase
      .from(tableName)
      .update(service)
      .eq('id', id)
      .select()
      .single()

    logger.log(
      `ServiceRepository.updateService: returned data: ${JSON.stringify(data)}`
    )

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      logger.error(
        `Error updating service with id "${id}" in Supabase for locale ${locale}:`,
        error
      )
      throw new Error(`Failed to update service: ${error.message}`)
    }
    // Note: revalidateTag will be called in the API route.
    return data ? ServiceMapper.toDomain(data as ServiceDTO) : null
  }

  async deleteService(id: string, locale: string): Promise<boolean> {
    const tableName = this.getTableName(locale)
    const { error, count } = await supabase
      .from(tableName)
      .delete({ count: 'exact' }) // Ensure count is returned
      .eq('id', id)
    // .select(); // .select() is not typically used with .delete() if you only need the count.

    if (error) {
      logger.error(
        `Error deleting service with id "${id}" from Supabase for locale ${locale}:`,
        error
      )
      throw new Error(`Failed to delete service: ${error.message}`)
    }
    // Note: revalidateTag will be called in the API route.
    return count !== null && count > 0
  }
}

export const serviceRepository = new ServiceRepository()
