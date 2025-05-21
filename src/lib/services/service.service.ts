import { IServiceRepository } from '../interfaces/service.interface';
import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { ServiceLocalRepository } from '../repositories/service.local.repository';
import { ServiceRepository } from '../repositories/service.repository'; // Assuming this is the remote repository
import { generateSlug } from '../utils/slugify'; // Assuming slugify utility exists

const MOCK_REPOSITORIES = process.env.MOCK_REPOSITORIES === 'true';

class ServiceService implements IServiceRepository {
  private repository: IServiceRepository;

  constructor() {
    this.repository = MOCK_REPOSITORIES
      ? new ServiceLocalRepository()
      : new ServiceRepository(); // Use the remote repository
  }

  async getServices(locale: string): Promise<Service[]> {
    return this.repository.getServices(locale);
  }

  async getServiceBySlug(slug: string, locale: string): Promise<Service | null> {
    return this.repository.getServiceBySlug(slug, locale);
  }

  async getServiceById(id: string, locale: string): Promise<Service | null> {
    return this.repository.getServiceById(id, locale);
  }

  async createService(service: Partial<ServiceDTO>, locale: string): Promise<Service> {
    // Business logic: Generate slug if not provided
    if (!service.slug && service.title) {
      service.slug = generateSlug(service.title);
    }

    // Business logic: Trim string fields (basic example)
    if (service.title) service.title = service.title.trim();
    if (service.subtitle) service.subtitle = service.subtitle.trim();
    if (service.excerpt) service.excerpt = service.excerpt.trim();
    if (service.image_url) service.image_url = service.image_url.trim();
    if (service.image_alt) service.image_alt = service.image_alt.trim();
    if (service.meta_title) service.meta_title = service.meta_title.trim();
    if (service.meta_description) service.meta_description = service.meta_description.trim();

    // Keywords are handled by the repository/mapper, no service-level logic needed here

    return this.repository.createService(service, locale);
  }

  async updateService(id: string, service: Partial<ServiceDTO>, locale: string): Promise<Service | null> {
    // Business logic: Trim string fields (basic example)
    if (service.title) service.title = service.title.trim();
    if (service.subtitle) service.subtitle = service.subtitle.trim();
    if (service.excerpt) service.excerpt = service.excerpt.trim();
    if (service.image_url) service.image_url = service.image_url.trim();
    if (service.image_alt) service.image_alt = service.image_alt.trim();
    if (service.meta_title) service.meta_title = service.meta_title.trim();
    if (service.meta_description) service.meta_description = service.meta_description.trim();

    // Keywords are handled by the repository/mapper, no service-level logic needed here

    return this.repository.updateService(id, service, locale);
  }

  async deleteService(id: string, locale: string): Promise<boolean> {
    return this.repository.deleteService(id, locale);
  }
}

export const serviceService = new ServiceService();
