import { IServiceRepository } from '../interfaces/service.interface';
import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { generateSlug } from '../utils/slugify';
import { serviceRepository } from '../repositories/service.repository';

/**
 * @class ServiceService
 * @desc Service class for managing services.
 */
class ServiceService {
  private readonly repository: IServiceRepository;

  /**
   * @constructor
   * @param {IServiceRepository} repository - The service repository to use.
   */
  constructor(repository: IServiceRepository) {
    this.repository = repository;
  }

  /**
   * @public
   * @async
   * @method getServices
   * @desc Gets all services for a given locale.
   * @param {string} locale - The locale to get services for.
   * @returns {Promise<Service[]>} A promise that resolves to an array of services.
   */
  async getServices(locale: string): Promise<Service[]> {
    return this.repository.getServices(locale);
  }

  /**
   * @public
   * @async
   * @method getServiceBySlug
   * @desc Gets a service by its slug for a given locale.
   * @param {string} slug - The slug of the service to get.
   * @param {string} locale - The locale to get the service for.
   * @returns {Promise<Service | null>} A promise that resolves to a service or null if not found.
   */
  async getServiceBySlug(slug: string, locale: string): Promise<Service | null> {
    return this.repository.getServiceBySlug(slug, locale);
  }

  /**
   * @public
   * @async
   * @method getServiceById
   * @desc Gets a service by its ID for a given locale.
   * @param {string} id - The ID of the service to get.
   * @param {string} locale - The locale to get the service for.
   * @returns {Promise<Service | null>} A promise that resolves to a service or null if not found.
   */
  async getServiceById(id: string, locale: string): Promise<Service | null> {
    return this.repository.getServiceById(id, locale);
  }

  /**
   * @public
   * @async
   * @method createService
   * @desc Creates a new service.
   * @param {Partial<ServiceDTO>} service - The service data to create.
   * @param {string} locale - The locale to create the service for.
   * @returns {Promise<Service>} A promise that resolves to the created service.
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
   * @public
   * @async
   * @method updateService
   * @desc Updates an existing service.
   * @param {string} id - The ID of the service to update.
   * @param {Partial<ServiceDTO>} service - The service data to update.
   * @param {string} locale - The locale to update the service for.
   * @returns {Promise<Service | null>} A promise that resolves to the updated service or null if not found.
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
   * @public
   * @async
   * @method deleteService
   * @desc Deletes a service by its ID for a given locale.
   * @param {string} id - The ID of the service to delete.
   * @param {string} locale - The locale to delete the service for.
   * @returns {Promise<boolean>} A promise that resolves to true if the service was deleted, false otherwise.
   */
  async deleteService(id: string, locale: string): Promise<boolean> {
    return this.repository.deleteService(id, locale);
  }
}

// Export the class as default
export default ServiceService;

// Export the singleton instance
// Export the class as named export
export { ServiceService };

// Export the singleton instance
// Export the class as named export
export { ServiceService };

// Export the singleton instance
export const serviceService = new ServiceService(serviceRepository);
export default ServiceService;
export { ServiceService };
export { ServiceService };
