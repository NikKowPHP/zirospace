import { ServiceLocalRepository } from './service.local.repository';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { Service } from '@/domain/models/service.model';
import { Database } from 'sqlite3';
import { getDatabaseFilePath } from '@/lib/config/database.config';

// Mock the database connection
jest.mock('sqlite3', () => {
  const mDatabase = {
    all: jest.fn(),
    get: jest.fn(),
    run: jest.fn(),
  };
  return {
    Database: jest.fn(() => mDatabase),
  };
});

jest.mock('@/lib/config/database.config', () => ({
  getDatabaseFilePath: jest.fn().mockReturnValue(':memory:'),
}));

describe('ServiceLocalRepository', () => {
  let serviceLocalRepository: ServiceLocalRepository;
  let dbMock: any;

  beforeEach(() => {
    serviceLocalRepository = new ServiceLocalRepository();
    dbMock = new Database(getDatabaseFilePath());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all services for a given locale', async () => {
    const mockServices: ServiceDTO[] = [
      { id: '1', slug: 'test-service-1', title: 'Test Service 1', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' },
      { id: '2', slug: 'test-service-2', title: 'Test Service 2', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' },
    ];
    dbMock.all.mockImplementation((query, params, callback) => {
      callback(null, mockServices);
    });

    const services = await serviceLocalRepository.getServices('en');

    expect(dbMock.all).toHaveBeenCalledTimes(1);
    expect(services.length).toBe(2);
    expect(services[0].id).toBe('1');
  });

  it('should get a service by its slug for a given locale', async () => {
    const mockService: ServiceDTO = { id: '1', slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' };
    dbMock.get.mockImplementation((query, params, callback) => {
      callback(null, mockService);
    });

    const service = await serviceLocalRepository.getServiceBySlug('test-service', 'en');

    expect(dbMock.get).toHaveBeenCalledTimes(1);
    expect(service.id).toBe('1');
  });

  it('should get a service by its ID for a given locale', async () => {
    const mockService: ServiceDTO = { id: '1', slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' };
    dbMock.get.mockImplementation((query, params, callback) => {
      callback(null, mockService);
    });

    const service = await serviceLocalRepository.getServiceById('1', 'en');

    expect(dbMock.get).toHaveBeenCalledTimes(1);
    expect(service.id).toBe('1');
  });

  it('should create a new service', async () => {
    const mockService: Partial<ServiceDTO> = { slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true };
    dbMock.run.mockImplementation((query, params, callback) => {
      callback(null);
    });
    dbMock.get.mockImplementation((query, params, callback) => {
      callback(null, { id: '1', ...mockService });
    });

    const service = await serviceLocalRepository.createService(mockService, 'en');

    expect(dbMock.run).toHaveBeenCalledTimes(1);
    expect(dbMock.get).toHaveBeenCalledTimes(1);
    expect(service.slug).toBe('test-service');
  });

  it('should update an existing service', async () => {
    const mockService: Partial<ServiceDTO> = { title: 'Updated Test Service' };
    dbMock.run.mockImplementation((query, params, callback) => {
      callback(null);
    });
    dbMock.get.mockImplementation((query, params, callback) => {
      callback(null, { id: '1', slug: 'test-service', title: 'Updated Test Service', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now' });
    });

    const service = await serviceLocalRepository.updateService('1', mockService, 'en');

    expect(dbMock.run).toHaveBeenCalledTimes(1);
    expect(dbMock.get).toHaveBeenCalledTimes(1);
    expect(service.title).toBe('Updated Test Service');
  });

  it('should delete a service', async () => {
    dbMock.run.mockImplementation((query, params, callback) => {
      callback(null);
    });

    const result = await serviceLocalRepository.deleteService('1', 'en');

    expect(dbMock.run).toHaveBeenCalledTimes(1);
    expect(result).toBe(undefined);
  });
});