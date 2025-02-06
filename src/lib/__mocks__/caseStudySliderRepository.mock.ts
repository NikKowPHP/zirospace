import { CaseStudySliderDTO } from '@/infrastructure/dto/case-study-slider.dto';
import { ICaseStudySliderRepository } from '@/lib/interfaces/caseStudySliderRepository.interface';
import { CaseStudySliderMapper } from '@/infrastructure/mappers/case-study-slider.mapper';

// Define mock case studies data for different locales
export const mockCaseStudySliderDTOs: CaseStudySliderDTO[] = [
  {
    id: '1',
    slug: 'case-study-1',
    title: 'Supernormal',
    subtitle: 'Rethinking Longevity',
    description: 'An app concept for Rejuvenation athletes powered by a health agent.',
    tags: ['tag1', 'tag2'],
    images: [{ url: '/images/case-studies/gsense/gsense.avif', alt: 'Image 1' }],
    cta_text: 'View Case Study',
    cta_text_name: 'viewCaseStudy',
    cta_url: '/case-study-1',
    color: '#fff',
    background_color: '#000',
    theme: 'dark',
    created_at: '2024-01-01T10:00:00.000Z',
    updated_at: '2024-01-02T10:00:00.000Z',
  },
  {
    id: '2',
    slug: 'case-study-2',
    title: 'Case Study Two',
    subtitle: 'Rethinking Longevity',
    description: 'Description for case study two.',
    tags: ['tag3', 'tag4'],
    images: [{ url: '/images/case-studies/gsense/gsense.avif', alt: 'Image 2' }],
    cta_text: 'Learn More',
    cta_text_name: 'learnMore',
    cta_url: '/case-study-2',
    color: '#000000',
    background_color: '#FFFFFF',
    theme: 'light',
    created_at: '2024-01-05T10:00:00.000Z',
    updated_at: '2024-01-06T10:00:00.000Z',
  },
];

// Mock Supabase client
export const mockCaseStudySliderRepository: ICaseStudySliderRepository = {
  getCaseStudiesSliders: async () => {
    return mockCaseStudySliderDTOs.map(CaseStudySliderMapper.toDomain);
  },
};
