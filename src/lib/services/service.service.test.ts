import { serviceService } from './service.service';
import { IServiceRepository } from '../interfaces/service.interface';
import { Service } from '../../domain/models/service.model';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { generateSlug } from '../utils/slugify';

describe('ServiceService', () => {
  let serviceService: ServiceService;
  let mockRepository: jest.Mocked<IServiceRepository>;

  beforeEach(() => {
    mockRepository = {
      getServices: jest.fn(),
      getServiceBySlug: jest.fn(),
      getServiceById: jest.fn(),
      createService: jest.fn(),
      updateService: jest.fn(),
      deleteService: jest.fn(),
    };
    serviceService = new ServiceService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getServices', () => {
    it('should return services from repository', async () => {
      const mockServices: Service[] = [{
        id: '1',
        slug: 'test-service',
        title: 'Test Service',
        content_html: 'content',
        is_published: true,
        created_at: new Date(),
        updated_at: new Date(),
        keywords: ['test', 'service']
      }];
      
      mockRepository.getServices.mockResolvedValue(mockServices);
      
      const result = await serviceService.getServices('en');
      
      expect(mockRepository.getServices).toHaveBeenCalledWith('en');
      expect(result).toEqual(mockServices);
    });
  });

  describe('getServiceBySlug', () => {
    it('should return service by slug from repository', async () => {
      const mockService: Service = {
        id: '1',
        slug: 'test-service',
        title: 'Test Service',
        content_html: 'content',
        is_published: true,
        created_at: new Date(),
        updated_at: new Date(),
        keywords: ['test', 'service']
      };
      
      mockRepository.getServiceBySlug.mockResolvedValue(mockService);
      
      const result = await serviceService.getServiceBySlug('test-service', 'en');
      
      expect(mockRepository.getServiceBySlug).toHaveBeenCalledWith('test-service', 'en');
      expect(result).toEqual(mockService);
    });
  });

  describe('createService', () => {
    it('should generate slug when not provided', async () => {
      const mockServiceDTO: Partial<ServiceDTO> = {
        title: 'Test Service',
        content_html: 'content',
        is_published: true
      };
      
      const expectedSlug = generateSlug(mockServiceDTO.title!);
      const createdService: Service = {
        ...mockServiceDTO as ServiceDTO,
        id: '1',
        slug: expectedSlug,
        created_at: new Date(),
        updated_at: new Date(),
        keywords: []
      };
      
      mockRepository.createService.mockResolvedValue(createdService);
      
      const result = await serviceService.createService(mockServiceDTO, 'en');
      
      expect(mockRepository.createService).toHaveBeenCalledWith(
        expect.objectContaining({ slug: expectedSlug }),
        'en'
      );
      expect(result.slug).toBe(expectedSlug);
    });

    it('should trim string fields', async () => {
      const mockServiceDTO: Partial<ServiceDTO> = {
        title: '  Test Service  ',
        subtitle: '  A subtitle  ',
        excerpt: '  An excerpt  ',
        content_html: '  content  ',
        is_published: true
      };
      
      const createdService: Service = {
        ...mockServiceDTO as ServiceDTO,
        id: '1',
        slug: 'test-service',
        created_at: new Date(),
        updated_at: new Date(),
        keywords: []
      };
      
      mockRepository.createService.mockResolvedValue(createdService);
      
      await serviceService.createService(mockServiceDTO, 'en');
      
      expect(mockRepository.createService).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Service',
          subtitle: 'A subtitle',
          excerpt: 'An excerpt',
          content_html: 'content'
        }),
        'en'
      );
    });
  });

  describe('updateService', () => {
    it('should trim string fields', async () => {
      const mockServiceDTO: Partial<ServiceDTO> = {
        title: '  Updated Service  ',
        subtitle: '  Updated subtitle  ',
        excerpt: '  Updated excerpt  '
      };
      
      const updatedService: Service = {
        id: '1',
        slug: 'test-service',
        title: 'Updated Service',
        subtitle: 'Updated subtitle',
        excerpt: 'Updated excerpt',
        content_html: 'content',
        is_published: true,
        created_at: new Date(),
        updated_at: new Date(),
        keywords: []
      };
      
      mockRepository.updateService.mockResolvedValue(updatedService);
      
      await serviceService.updateService('1', mockServiceDTO, 'en');
      
      expect(mockRepository.updateService).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          title: 'Updated Service',
          subtitle: 'Updated subtitle',
          excerpt: 'Updated excerpt'
        }),
        'en'
      );
    });
  });

  describe('deleteService', () => {
    it('should call repository delete method', async () => {
      mockRepository.deleteService.mockResolvedValue(true);
      
      const result = await serviceService.deleteService('1', 'en');
      
      expect(mockRepository.deleteService).toHaveBeenCalledWith('1', 'en');
      expect(result).toBe(true);
    });
  });
});
