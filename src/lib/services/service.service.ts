import { IServiceRepository } from '../interfaces/service.interface';
import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { serviceLocalRepository } from '../repositories/service.local.repository';
import { serviceRepository } from '../repositories/service.repository';
import { generateSlug } from '@/lib/utils/slugify';

const MOCK_REPOSITORIES = process.env.MOCK_REPOSITORIES === 'true';

export class ServiceService {
  private readonly serviceRepository: IServiceRepository;

  constructor(serviceRepository: IServiceRepository) {
    this.serviceRepository = serviceRepository;
  }

  async getServices(locale: string): Promise<Service[]> {
    return this.serviceRepository.getServices(locale);
  }

  async getServiceBySlug(slug: string, locale: string): Promise<Service | null> {
    return this.serviceRepository.getServiceBySlug(slug, locale);
  }

  async getServiceById(id: string, locale: string): Promise<Service | null> {
    return this.serviceRepository.getServiceById(id, locale);
  }

  async createService(service: Partial<ServiceDTO>, locale: string): Promise<Service> {
    let slug = service.slug;
    if (!slug && service.title) {
      slug = generateSlug(service.title);
    }

    const trimmedService: Partial<ServiceDTO> = {
      ...service,
      slug,
      title: service.title?.trim(),
      subtitle: service.subtitle?.trim(),
      excerpt: service.excerpt?.trim(),
      meta_title: service.meta_title?.trim(),
      meta_description: service.meta_description?.trim(),
    };

    return this.serviceRepository.createService(trimmedService, locale);
  }

  async updateService(id: string, service: Partial<ServiceDTO>, locale: string): Promise<Service | null> {
    const trimmedService: Partial<ServiceDTO> = {
      ...service,
      title: service.title?.trim(),
      subtitle: service.subtitle?.trim(),
      excerpt: service.excerpt?.trim(),
      meta_title: service.meta_title?.trim(),
      meta_description: service.meta_description?.trim(),
    };

    return this.serviceRepository.updateService(id, trimmedService, locale);
  }

  async deleteService(id: string, locale: string): Promise<boolean> {
    return this.serviceRepository.deleteService(id, locale);
  }
}

export const serviceService = new ServiceService(
  MOCK_REPOSITORIES ? serviceLocalRepository : serviceRepository
);