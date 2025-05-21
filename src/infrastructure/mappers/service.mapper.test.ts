import { ServiceMapper } from './service.mapper';
import { ServiceDTO } from '../dto/service.dto';
import { Service } from '@/domain/models/service.model';

describe('ServiceMapper', () => {
  it('should map a ServiceDTO to a Service domain model', () => {
    const serviceDTO: ServiceDTO = {
      id: '1',
      slug: 'test-service',
      title: 'Test Service',
      subtitle: 'Test Subtitle',
      content_html: '<p>Test Content</p>',
      excerpt: 'Test Excerpt',
      image_url: 'test.jpg',
      image_alt: 'Test Alt',
      meta_title: 'Test Meta Title',
      meta_description: 'Test Meta Description',
      keywords: ['keyword1', 'keyword2'],
      is_published: true,
      order_index: 0,
      created_at: '2025-05-21T00:00:00.000Z',
      updated_at: '2025-05-21T00:00:00.000Z',
    };

    const service: Service = ServiceMapper.toDomain(serviceDTO);

    expect(service).toEqual({
      id: '1',
      slug: 'test-service',
      title: 'Test Service',
      subtitle: 'Test Subtitle',
      contentHtml: '<p>Test Content</p>',
      excerpt: 'Test Excerpt',
      imageUrl: 'test.jpg',
      imageAlt: 'Test Alt',
      metaTitle: 'Test Meta Title',
      metaDescription: 'Test Meta Description',
      keywords: ['keyword1', 'keyword2'],
      isPublished: true,
      orderIndex: 0,
      createdAt: '2025-05-21T00:00:00.000Z',
      updatedAt: '2025-05-21T00:00:00.000Z',
    });
  });

  it('should map a Service domain model to a ServiceDTO for persistence', () => {
    const service: Service = {
      id: '1',
      slug: 'test-service',
      title: 'Test Service',
      subtitle: 'Test Subtitle',
      contentHtml: '<p>Test Content</p>',
      excerpt: 'Test Excerpt',
      imageUrl: 'test.jpg',
      imageAlt: 'Test Alt',
      metaTitle: 'Test Meta Title',
      metaDescription: 'Test Meta Description',
      keywords: ['keyword1', 'keyword2'],
      isPublished: true,
      orderIndex: 0,
      createdAt: '2025-05-21T00:00:00.000Z',
      updatedAt: '2025-05-21T00:00:00.000Z',
    };

    const serviceDTO: Partial<ServiceDTO> = ServiceMapper.toPersistence(service);

    expect(serviceDTO).toEqual({
      id: '1',
      slug: 'test-service',
      title: 'Test Service',
      subtitle: 'Test Subtitle',
      content_html: '<p>Test Content</p>',
      excerpt: 'Test Excerpt',
      image_url: 'test.jpg',
      image_alt: 'Test Alt',
      meta_title: 'Test Meta Title',
      meta_description: 'Test Meta Description',
      keywords: ['keyword1', 'keyword2'],
      is_published: true,
      order_index: 0,
      created_at: '2025-05-21T00:00:00.000Z',
      updated_at: '2025-05-21T00:00:00.000Z',
    });
  });
});