import { ServiceRepository } from './service.repository';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { Service } from '@/domain/models/service.model';
import { createClient } from '@supabase/supabase-js';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => {
  const mSupabase = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
        single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        then: jest.fn(),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null, count: 1 })),
      })),
    })),
  };
  return {
    createClient: jest.fn(() => mSupabase),
  };
});

describe('ServiceRepository', () => {
  let serviceRepository: ServiceRepository;
  let supabaseMock: any;

  beforeEach(() => {
    serviceRepository = new ServiceRepository();
    supabaseMock = createClient('', '');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all services for a given locale', async () => {
    const tableName = 'zirospace_services_en';
    const mockServices: ServiceDTO[] = [
      { id: '1', slug: 'test-service-1', title: 'Test Service 1', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' },
      { id: '2', slug: 'test-service-2', title: 'Test Service 2', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' },
    ];

    (supabaseMock.from(tableName).select as jest.Mock).mockResolvedValueOnce({ data: mockServices, error: null });

    const services = await serviceRepository.getServices('en');

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(services.length).toBe(2);
    expect(services[0].id).toBe('1');
  });

  it('should get a service by its slug for a given locale', async () => {
    const tableName = 'zirospace_services_en';
    const mockService: ServiceDTO = { id: '1', slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' };

    (supabaseMock.from(tableName).select as jest.Mock).mockResolvedValueOnce({ data: [mockService], error: null });

    const service = await serviceRepository.getServiceBySlug('test-service', 'en');

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(service!.id).toBe('1');
  });

  it('should get a service by its ID for a given locale', async () => {
    const tableName = 'zirospace_services_en';
    const mockService: ServiceDTO = { id: '1', slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' };

    (supabaseMock.from(tableName).select as jest.Mock).mockResolvedValueOnce({ data: [mockService], error: null });

    const service = await serviceRepository.getServiceById('1', 'en');

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(service!.id).toBe('1');
  });

  it('should create a new service', async () => {
    const tableName = 'zirospace_services_en';
    const mockService: Partial<ServiceDTO> = { slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true };
    const mockCreatedService: ServiceDTO = { id: '3', slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' };

    (supabaseMock.from(tableName).insert as jest.Mock).mockResolvedValueOnce({ data: [mockCreatedService], error: null });

    const service = await serviceRepository.createService(mockService, 'en');

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(service.slug).toBe('test-service');
  });

  it('should update an existing service', async () => {
    const tableName = 'zirospace_services_en';
    const mockService: Partial<ServiceDTO> = { title: 'Updated Test Service' };
    const mockUpdatedService: ServiceDTO = { id: '1', slug: 'test-service', title: 'Updated Test Service', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' };

    (supabaseMock.from(tableName).update as jest.Mock).mockResolvedValueOnce({ data: [mockUpdatedService], error: null });

    const service = await serviceRepository.updateService('1', mockService, 'en');

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(service!.title).toBe('Updated Test Service');
  });

  it('should delete a service', async () => {
    const tableName = 'zirospace_services_en';

    (supabaseMock.from(tableName).delete as jest.Mock).mockResolvedValueOnce({ error: null, count: 1 });

    const result = await serviceRepository.deleteService('1', 'en');

    expect(supabaseMock.from).toHaveBeenCalledWith(tableName);
    expect(result).toBe(true);
  });
});