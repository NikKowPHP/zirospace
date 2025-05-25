import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';

/**
 * Interface for service repository.
 */
export interface IServiceRepository {
  /**
   * Gets all services for a given locale.
   * @param locale The locale to get services for.
   * @returns A promise that resolves to an array of services.
   */
  getServices(locale: string): Promise<Service[]>;
  /**
   * Gets a service by its slug for a given locale.
   * @param slug The slug of the service to get.
   * @param locale The locale to get the service for.
   * @returns A promise that resolves to a service or null if not found.
   */
  getServiceBySlug(slug: string, locale: string): Promise<Service | null>;
  /**
   * Gets a service by its ID for a given locale.
   * @param id The ID of the service to get.
   * @param locale The locale to get the service for.
   * @returns A promise that resolves to a service or null if not found.
   */
  getServiceById(id: string, locale: string): Promise<Service | null>;
  /**
   * Creates a new service.
   * @param service The service data to create.
   * @param locale The locale to create the service for.
   * @returns A promise that resolves to the created service.
   */
  createService(service: Partial<ServiceDTO>, locale: string): Promise<Service>;
  /**
   * Updates an existing service.
   * @param id The ID of the service to update.
   * @param service The service data to update.
   * @param locale The locale to update the service for.
   * @returns A promise that resolves to the updated service or null if not found.
   */
  updateService(id: string, service: Partial<ServiceDTO>, locale: string): Promise<Service | null>;
  /**
   * Deletes a service by its ID for a given locale.
   * @param id The ID of the service to delete.
   * @param locale The locale to delete the service for.
   * @returns A promise that resolves to true if the service was deleted, false otherwise.
   */
  deleteService(id: string, locale: string): Promise<boolean>;
}