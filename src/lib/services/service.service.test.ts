import { IServiceRepository } from '../interfaces/service.interface';
import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';

// Mock the service repository
const mockServiceRepository: IServiceRepository = {
  getServices: jest.fn(),
  getServiceBySlug: jest.fn(),
  getServiceById: jest.fn(),
  createService: jest.fn(),
  updateService: jest.fn(),
  deleteService: jest.fn(),
};

describe('ServiceService', () => {
  let serviceService: ServiceService;

  beforeEach(() => {
    serviceService = new ServiceService(mockServiceRepository);
    jest.clearAllMocks();
  });

  it('should get all services for a given locale', async () => {
    const mockServices: Service[] = [
      { id: '1', slug: 'test-service-1', title: 'Test Service 1', contentHtml: 'content', isPublished: true, createdAt: 'now', updatedAt: 'now' },
      { id: '2', slug: 'test-service-2', title: 'Test Service 2', contentHtml: 'content', isPublished: true, createdAt: 'now', updatedAt: 'now' },
    ];
    (mockServiceRepository.getServices as jest.Mock).mockResolvedValue(mockServices);

    const services = await serviceService.getServices('en');

    expect(mockServiceRepository.getServices).toHaveBeenCalledWith('en');
    expect(services.length).toBe(2);
    expect(services[0].id).toBe('1');
  });

  it('should get a service by its slug for a given locale', async () => {
    const mockService: Service = { id: '1', slug: 'test-service', title: 'Test Service', contentHtml: 'content', isPublished: true, createdAt: 'now', updatedAt: 'now' };
    (mockServiceRepository.getServiceBySlug as jest.Mock).mockResolvedValue(mockService);

    const service = await serviceService.getServiceBySlug('test-service', 'en');

    expect(mockServiceRepository.getServiceBySlug).toHaveBeenCalledWith('test-service', 'en');
    expect(service).toEqual(mockService);
  });

  it('should get a service by its ID for a given locale', async () => {
    const mockService: Service = { id: '1', slug: 'test-service', title: 'Test Service', contentHtml: 'content', isPublished: true, createdAt: 'now', updatedAt: 'now' };
    (mockServiceRepository.getServiceById as jest.Mock).mockResolvedValue(mockService);

    const service = await serviceService.getServiceById('1', 'en');

    expect(mockServiceRepository.getServiceById).toHaveBeenCalledWith('1', 'en');
    expect(service).toEqual(mockService);
  });

  it('should create a new service', async () => {
    const mockServiceDTO: Partial<ServiceDTO> = { slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true };
    const mockCreatedService: Service = { id: '3', slug: 'test-service', title: 'Test Service', contentHtml: 'content', isPublished: true, createdAt: 'now', updatedAt: 'now' };
    (mockServiceRepository.createService as jest.Mock).mockResolvedValue(mockCreatedService);

    const service = await serviceService.createService(mockServiceDTO, 'en');

    expect(mockServiceRepository.createService).toHaveBeenCalledWith(mockServiceDTO, 'en');
    expect(service.slug).toBe('test-service');
  });

  it('should update an existing service', async () => {
    const mockServiceDTO: Partial<ServiceDTO> = { title: 'Updated Test Service' };
    const mockUpdatedService: Service = { id: '1', slug: 'test-service', title: 'Updated Test Service', contentHtml: 'content', isPublished: true, createdAt: 'now', updatedAt: 'now' };
    (mockServiceRepository.updateService as jest.Mock).mockResolvedValue(mockUpdatedService);

    const service = await serviceService.updateService('1', mockServiceDTO, 'en');

    expect(mockServiceRepository.updateService).toHaveBeenCalledWith('1', mockServiceDTO, 'en');
    expect(service.title).toBe('Updated Test Service');
  });

  it('should delete a service', async () => {
    (mockServiceRepository.deleteService as jest.Mock).mockResolvedValue(true);

    const result = await serviceService.deleteService('1', 'en');

    expect(mockServiceRepository.deleteService).toHaveBeenCalledWith('1', 'en');
    expect(result).toBe(true);
  });

  it('should generate slug if not provided on create', async () => {
    const mockServiceDTO: Partial<ServiceDTO> = { title: 'Test Service' };
    const mockCreatedService: Service = { id: '3', slug: 'test-service', title: 'Test Service', contentHtml: 'content', isPublished: true, createdAt: 'now', updatedAt: 'now' };
    (mockServiceRepository.createService as jest.Mock).mockResolvedValue(mockCreatedService);

    const service = await serviceService.createService(mockServiceDTO, 'en');

    expect(mockServiceRepository.createService).toHaveBeenCalledWith(expect.objectContaining({ slug: 'test-service' }), 'en');
    expect(service.slug).toBe('test-service');
  });

  it('should trim string fields on create', async () => {
    const mockServiceDTO: Partial<ServiceDTO> = { title: '  Test Service  ', subtitle: '  Test Subtitle  ' };
    const mockCreatedService: Service = { id: '3', slug: 'test-service', title: 'Test Service', subtitle: 'Test Subtitle', contentHtml: 'content', isPublished: true, createdAt: 'now', updatedAt: 'now' };
    (mockServiceRepository.createService as jest.Mock).mockResolvedValue(mockCreatedService);

    await serviceService.createService(mockServiceDTO, 'en');

    expect(mockServiceRepository.createService).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test Service', subtitle: 'Test Subtitle' }), 'en');
  });

  it('should trim string fields on update', async () => {
    const mockServiceDTO: Partial<ServiceDTO> = { title: '  Updated Test Service  ', subtitle: '  Updated Test Subtitle  ' };
    const mockUpdatedService: Service = { id: '1', slug: 'test-service', title: 'Updated Test Service', subtitle: 'Updated Test Subtitle', contentHtml: 'content', isPublished: true, createdAt: 'now', updatedAt: 'now' };
    (mockServiceRepository.updateService as jest.Mock).mockResolvedValue(mockUpdatedService);

    await serviceService.updateService('1', mockServiceDTO, 'en');

    expect(mockServiceRepository.updateService).toHaveBeenCalledWith('1', expect.objectContaining({ title: 'Updated Test Service', subtitle: 'Updated Test Subtitle' }), 'en');
  });
});
