import { ServiceMapper } from './service.mapper';
import { ServiceDTO } from '../dto/service.dto';
import { Service } from '@/domain/models/service.model';

describe('ServiceMapper', () => {
  it('should map a ServiceDTO with keywords as array to a Service domain model', () => {
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

  it('should map a ServiceDTO with keywords as JSON string to a Service domain model', () => {
    const serviceDTO: ServiceDTO = {
      id: '2',
      slug: 'another-service',
      title: 'Another Service',
      subtitle: 'Another Subtitle',
      content_html: '<p>Another Content</p>',
      excerpt: 'Another Excerpt',
      image_url: 'another.png',
      image_alt: 'Another Alt',
      meta_title: 'Another Meta Title',
      meta_description: 'Another Meta Description',
      keywords: '["tag1", "tag2"]', // Simulate JSON string from DB
      is_published: false,
      order_index: 1,
      created_at: '2025-05-21T01:00:00.000Z',
      updated_at: '2025-05-21T01:00:00.000Z',
    };

    const service: Service = ServiceMapper.toDomain(serviceDTO);

    expect(service).toEqual({
      id: '2',
      slug: 'another-service',
      title: 'Another Service',
      subtitle: 'Another Subtitle',
      contentHtml: '<p>Another Content</p>',
      excerpt: 'Another Excerpt',
      imageUrl: 'another.png',
      imageAlt: 'Another Alt',
      metaTitle: 'Another Meta Title',
      metaDescription: 'Another Meta Description',
      keywords: ['tag1', 'tag2'],
      isPublished: false,
      orderIndex: 1,
      createdAt: '2025-05-21T01:00:00.000Z',
      updatedAt: '2025-05-21T01:00:00.000Z',
    });
  });


  it('should map a Service domain model to a ServiceDTO for persistence with keywords as JSON string', () => {
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
      keywords: '["keyword1","keyword2"]', // Expect JSON string
      is_published: true,
      order_index: 0,
      created_at: '2025-05-21T00:00:00.000Z',
      updated_at: '2025-05-21T00:00:00.000Z',
    });
  });
});
