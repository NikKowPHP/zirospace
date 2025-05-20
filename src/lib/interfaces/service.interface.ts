import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';

export interface IServiceRepository {
  getServices(locale: string): Promise<Service[]>;
  getServiceBySlug(slug: string, locale: string): Promise<Service | null>;
  getServiceById(id: string, locale: string): Promise<Service | null>;
  createService(service: Partial<ServiceDTO>, locale: string): Promise<Service>;
  updateService(id: string, service: Partial<ServiceDTO>, locale: string): Promise<Service | null>;
  deleteService(id: string, locale: string): Promise<boolean>;
}