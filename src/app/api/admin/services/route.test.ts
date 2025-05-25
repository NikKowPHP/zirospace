/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST, GET, PUT, DELETE } from './route';
import { serviceService } from '@/lib/services/service.service';
import { ServiceDTO } from '@/infrastructure/dto/service.dto';
import { Service } from '@/domain/models/service.model';

// Mock the serviceService
jest.mock('@/lib/services/service.service', () => ({
  serviceService: {
    createService: jest.fn(),
    getServiceById: jest.fn(),
    updateService: jest.fn(),
    deleteService: jest.fn(),
  },
}));

describe('API Endpoints for Services', () => {
  interface RequestBody {
    data: Partial<ServiceDTO>;
    locale: string;
  }

  const mockRequest = (method: string, body: RequestBody | Partial<ServiceDTO> | null, searchParams?: Record<string, string>) => {
    const url = new URL('http://localhost/api/admin/services');
    if (searchParams) {
      Object.keys(searchParams).forEach(key => url.searchParams.append(key, searchParams[key]));
    }

    return new NextRequest(url.href, {
      method: method,
      body: body ? JSON.stringify(body) : null,
    });
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should create a new service', async () => {
      const mockServiceDTO: Partial<ServiceDTO> = { title: 'Test Service', slug: 'test-service', content_html: '<p>Test</p>' };
      const mockCreatedService: Service = { id: '1', title: 'Test Service', slug: 'test-service', contentHtml: '<p>Test</p>', isPublished: true, createdAt: 'now', updatedAt: 'now' };
      (serviceService.createService as jest.Mock).mockResolvedValue(mockCreatedService);

      const request = mockRequest('POST', { data: mockServiceDTO, locale: 'en' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCreatedService);
      expect(serviceService.createService).toHaveBeenCalledWith(mockServiceDTO, 'en');
    });

    it('should return an error if service creation fails', async () => {
      (serviceService.createService as jest.Mock).mockRejectedValue(new Error('Creation failed'));

      const request = mockRequest('POST', { data: { title: 'Test Service' }, locale: 'en' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to create service', details: 'Creation failed' });
    });
  });

  describe('GET', () => {
    it('should get a service by ID', async () => {
      const mockService: Service = { id: '1', title: 'Test Service', slug: 'test-service', contentHtml: '<p>Test</p>', isPublished: true, createdAt: 'now', updatedAt: 'now' };
      (serviceService.getServiceById as jest.Mock).mockResolvedValue(mockService);

      const request = mockRequest('GET', null, { id: '1', locale: 'en' });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockService);
      expect(serviceService.getServiceById).toHaveBeenCalledWith('1', 'en');
    });

    it('should return 404 if service is not found', async () => {
      (serviceService.getServiceById as jest.Mock).mockResolvedValue(null);

      const request = mockRequest('GET', null, { id: '1', locale: 'en' });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Service not found' });
    });

    it('should return an error if ID or locale is missing', async () => {
      const request = mockRequest('GET', null, { id: '1' });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'ID and locale are required' });
    });
  });

  describe('PUT', () => {
    it('should update an existing service', async () => {
      const mockServiceDTO: Partial<ServiceDTO> = { title: 'Updated Test Service' };
      const mockUpdatedService: Service = { id: '1', title: 'Updated Test Service', slug: 'test-service', contentHtml: '<p>Test</p>', isPublished: true, createdAt: 'now', updatedAt: 'now' };
      (serviceService.updateService as jest.Mock).mockResolvedValue(mockUpdatedService);

      const request = mockRequest('PUT', { data: mockServiceDTO }, { id: '1', locale: 'en' });
      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUpdatedService);
      expect(serviceService.updateService).toHaveBeenCalledWith('1', mockServiceDTO, 'en');
    });

    it('should return 404 if service is not found', async () => {
      (serviceService.updateService as jest.Mock).mockResolvedValue(null);

      const request = mockRequest('PUT', { data: { title: 'Updated Test Service' } }, { id: '1', locale: 'en' });
      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Service not found' });
    });

    it('should return an error if ID or locale is missing', async () => {
      const request = mockRequest('PUT', { data: { title: 'Updated Test Service' } }, { id: '1' });
      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'ID and locale are required' });
    });
  });

  describe('DELETE', () => {
    it('should delete a service', async () => {
      (serviceService.deleteService as jest.Mock).mockResolvedValue(true);

      const request = mockRequest('DELETE', null, { id: '1', locale: 'en' });
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(serviceService.deleteService).toHaveBeenCalledWith('1', 'en');
    });

    it('should return 404 if service is not found', async () => {
      (serviceService.deleteService as jest.Mock).mockResolvedValue(false);

      const request = mockRequest('DELETE', null, { id: '1', locale: 'en' });
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Service not found' });
    });

    it('should return an error if ID or locale is missing', async () => {
      const request = mockRequest('DELETE', null, { id: '1' });
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'ID and locale are required' });
    });
  });
});