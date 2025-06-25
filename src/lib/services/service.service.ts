import { Locale } from '@/i18n'
import { Service } from '@/domain/models/models'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { generateSlug } from '@/lib/utils/slugify'
import { CACHE_TAGS } from '@/lib/utils/cache'
import logger from '@/lib/logger'

export interface OrderUpdate {
  id: string
  order: number
}

export class ServiceService {
  private getModel(locale: Locale) {
    return locale === 'pl' ? prisma.zirospace_services_pl : prisma.zirospace_services_en
  }

  private withCache<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    key: string,
    tags: string[]
  ): T {
    return unstable_cache(fn, [key], { tags }) as T
  }

  async getServices(locale: Locale): Promise<Service[]> {
    const cachedFn = this.withCache(
      async (locale: Locale) => {
        const model = this.getModel(locale)
        return (model as any).findMany({
          orderBy: { order_index: 'asc' },
        })
      },
      `services-${locale}`,
      [CACHE_TAGS.SERVICES, `services:${locale}`]
    )
    return cachedFn(locale)
  }

  
  async getServiceBySlug(slug: string, locale: Locale): Promise<Service | null> {
    const model = this.getModel(locale)
    return (model as any).findFirst({
      where: { slug },
    })
  }

  async getServiceById(id: string, locale: Locale): Promise<Service | null> {
    const model = this.getModel(locale)
    return (model as any).findUnique({
      where: { id },
    })
  }


  async createService(service: Partial<Service>, locale: Locale): Promise<Service> {
    // Business logic: Generate slug if not provided
    if (!service.slug && service.title) {
      service.slug = generateSlug(service.title);
    }

 
    // Trim all string fields
    this.trimStrings(service);

    const model = this.getModel(locale)
    return (model as any).create({
      data: service as any,
    })
  }

 
  async updateService(id: string, service: Partial<Service>, locale: Locale): Promise<Service | null> {
    // Trim all string fields
    this.trimStrings(service);

    logger.log('Updating service with ID:', id, 'and locale:', locale);

    const model = this.getModel(locale)
    return (model as any).update({
      where: { id },
      data: service as any,
    })
  }

  private trimStrings(obj: Record<string, any>): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      }
    }
  
  }

 
  async deleteService(id: string, locale: Locale): Promise<boolean> {
    const model = this.getModel(locale)
    try {
      await (model as any).delete({
        where: { id },
      })
      return true
    } catch (error) {
      logger.error(`Error deleting service with ID ${id} for locale ${locale}:`, error);
      return false
    }
  }
}



// Export the singleton instance
export const serviceService = new ServiceService();

// Export the class as default
export default ServiceService;
