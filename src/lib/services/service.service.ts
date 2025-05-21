import { IServiceRepository } from '../interfaces/service.interface';
import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { ServiceLocalRepository } from '../repositories/service.local.repository';
import { ServiceRepository } from '../repositories/service.repository'; // Assuming this is the remote repository
import { generateSlug } from '../utils/slugify'; // Assuming slugify utility exists

import { IServiceRepository } from '../interfaces/service.interface';
import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { IServiceRepository } from '../interfaces/service.interface';
import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { generateSlug } from '../utils/slugify'; // Assuming slugify utility exists

/**
 * Service class for managing services.
 */
class ServiceService {
  private repository: IServiceRepository;

  /**
   * Constructor for ServiceService.
   * @param repository The service repository to use.
   */
  constructor(repository: IServiceRepository) {
    this.repository = repository;
  }

  /**
   * Gets all services for a given locale.
   * @param locale The locale to get services for.
   * @returns A promise that resolves to an array of services.
   */
  async getServices(locale: string): Promise<Service[]> {
    return this.repository.getServices(locale);
  }

  /**
   * Gets a service by its slug for a given locale.
   * @param slug The slug of the service to get.
   * @param locale The locale to get the service for.
   * @returns A promise that resolves to a service or null if not found.
   */
  async getServiceBySlug(slug: string, locale: string): Promise<Service | null> {
    return this.repository.getServiceBySlug(slug, locale);
  }

  /**
   * Gets a service by its ID for a given locale.
   * @param id The ID of the service to get.
   * @param locale The locale to get the service for.
   * @returns A promise that resolves to a service or null if not found.
   */
  async getServiceById(id: string, locale: string): Promise<Service | null> {
    return this.repository.getServiceById(id, locale);
  }

  /**
   * Creates a new service.
   * @param service The service data to create.
   * @param locale The locale to create the service for.
   * @returns A promise that resolves to the created service.
   */
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

  /**
   * Updates an existing service.
   * @param id The ID of the service to update.
   * @param service The service data to update.
   * @param locale The locale to update the service for.
   * @returns A promise that resolves to the updated service or null if not found.
   */
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

  /**
   * Deletes a service by its ID for a given locale.
   * @param id The ID of the service to delete.
   * @param locale The locale to delete the service for.
   * @returns A promise that resolves to true if the service was deleted, false otherwise.
   */
  async deleteService(id: string, locale: string): Promise<boolean> {
    return this.repository.deleteService(id, locale);
  }
}

export const serviceService = new ServiceService(new ServiceRepository());
