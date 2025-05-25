import { ServiceLocalRepository } from './service.local.repository';
import { ServiceDTO } from '../../infrastructure/dto/service.dto';
import { Database } from 'sqlite3';

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

type MockDatabase = {
  all: jest.Mock;
  get: jest.Mock;
  run: jest.Mock;
};

describe('ServiceLocalRepository', () => {
  let serviceLocalRepository: ServiceLocalRepository;
  let dbMock: MockDatabase;

  beforeEach(() => {
    serviceLocalRepository = new ServiceLocalRepository();
    dbMock = (Database as unknown as jest.Mock).mock.instances[0] as MockDatabase;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct table name based on the locale', () => {
    expect(serviceLocalRepository['getTableName']('en')).toBe('services_en');
    expect(serviceLocalRepository['getTableName']('pl')).toBe('services_pl');
  });

  it('should get all services for a given locale', async () => {
    const mockServices: ServiceDTO[] = [
      {
        id: '1',
        slug: 'test-service-1',
        title: 'Test Service 1',
        content_html: 'content',
        is_published: true,
        created_at: 'now',
        updated_at: 'now',
        keywords: '["test","service"]'
      },
      {
        id: '2',
        slug: 'test-service-2',
        title: 'Test Service 2',
        content_html: 'content',
        is_published: false,  // Test different published state
        created_at: 'now',
        updated_at: 'now',
        keywords: '[]'
      },
    ];
    dbMock.all.mockImplementation((
      query: string,
      params: (string | number | boolean)[],
      callback: (err: Error | null, rows: ServiceDTO[]) => void
    ) => {
      callback(null, mockServices);
    });

    // Test empty case
    dbMock.all.mockImplementationOnce((
      query: string,
      params: (string | number | boolean)[],
      callback: (err: Error | null, rows: ServiceDTO[]) => void
    ) => {
      callback(null, []);
    });
    const emptyServices = await serviceLocalRepository.getServices('en');
    expect(emptyServices).toEqual([]);

    const services = await serviceLocalRepository.getServices('en');

    expect(dbMock.all).toHaveBeenCalledTimes(1);
    expect(dbMock.all).toHaveBeenCalledWith('SELECT * FROM services_en', [], expect.any(Function));
    expect(services.length).toBe(2);
    expect(services[0].id).toBe('1');
  });

  it('should get a service by its slug for a given locale', async () => {
    const mockService: ServiceDTO = { id: '1', slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now', keywords: '[]' };
    dbMock.get.mockImplementation((
      query: string,
      params: (string | number | boolean)[],
      callback: (err: Error | null, row: ServiceDTO) => void
    ) => {
      callback(null, mockService);
    });

    const service = await serviceLocalRepository.getServiceBySlug('test-service', 'en');

    expect(dbMock.get).toHaveBeenCalledTimes(1);
    expect(dbMock.get).toHaveBeenCalledWith('SELECT * FROM services_en WHERE slug = ?', ['test-service'], expect.any(Function));
    expect(service?.id).toBe('1');
  });

  it('should get a service by its ID for a given locale', async () => {
    const mockService: ServiceDTO = { id: '1', slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now', keywords: '[]' };
    dbMock.get.mockImplementation((
      query: string,
      params: (string | number | boolean)[],
      callback: (err: Error | null, row: ServiceDTO) => void
    ) => {
      callback(null, mockService);
    });

    const service = await serviceLocalRepository.getServiceById('1', 'en');

    expect(dbMock.get).toHaveBeenCalledTimes(1);
    expect(dbMock.get).toHaveBeenCalledWith('SELECT * FROM services_en WHERE id = ?', ['1'], expect.any(Function));
    expect(service?.id).toBe('1');
  });

  it('should create a new service', async () => {
    const mockService: Partial<ServiceDTO> = { slug: 'test-service', title: 'Test Service', content_html: 'content', is_published: true, keywords: [] };
    dbMock.run.mockImplementation((
      query: string,
      params: (string | number | boolean)[],
      callback: (err: Error | null) => void
    ) => {
      callback(null);
    });
    dbMock.get.mockImplementation((
      query: string,
      params: (string | number | boolean)[],
      callback: (err: Error | null, row: ServiceDTO) => void
    ) => {
      callback(null, { id: '1', ...mockService, created_at: 'now', updated_at: 'now' } as ServiceDTO);
    });

    const service = await serviceLocalRepository.createService(mockService, 'en');

    expect(dbMock.run).toHaveBeenCalledTimes(1);
    expect(dbMock.get).toHaveBeenCalledTimes(1);
    expect(service.slug).toBe('test-service');
  });

  it('should update an existing service', async () => {
    const mockService: Partial<ServiceDTO> = { title: 'Updated Test Service' };
    dbMock.run.mockImplementation((
      query: string,
      params: (string | number | boolean)[],
      callback: (err: Error | null) => void
    ) => {
      callback(null);
    });
    dbMock.get.mockImplementation((
      query: string,
      params: (string | number | boolean)[],
      callback: (err: Error | null, row: ServiceDTO) => void
    ) => {
      callback(null, { id: '1', slug: 'test-service', title: 'Updated Test Service', content_html: 'content', is_published: true, created_at: 'now', updated_at: 'now', keywords: '[]' } as ServiceDTO);
    });

    const service = await serviceLocalRepository.updateService('1', mockService, 'en');

    expect(dbMock.run).toHaveBeenCalledTimes(1);
    expect(dbMock.get).toHaveBeenCalledTimes(1);
    expect(service?.title).toBe('Updated Test Service');
  });

  it('should delete a service', async () => {
    dbMock.run.mockImplementation((
      query: string,
      params: string[], // Only ID is passed which is a string
      callback: (err: Error | null) => void
    ) => {
      callback(null);
    });

    const result = await serviceLocalRepository.deleteService('1', 'en');

    expect(dbMock.run).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });
});
