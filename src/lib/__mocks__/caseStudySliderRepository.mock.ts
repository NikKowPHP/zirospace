import { CaseStudySliderDTO } from '@/infrastructure/dto/case-study-slider.dto';
import { ICaseStudySliderRepository } from '@/lib/interfaces/caseStudySliderRepository.interface';
import { CaseStudySliderMapper } from '@/infrastructure/mappers/case-study-slider.mapper';

// Define mock case studies data for different locales
export const mockCaseStudySliderDTOs: CaseStudySliderDTO[] = [
  {
    id: '1',
    images: [{ id: '1', image: '/images/case-studies/gsense/gsense.avif', alt: 'Image 1' }, { id: '2', image: '/images/case-studies/gsense/gsense.avif', alt: 'Image 2' }, { id: '3', image: '/images/case-studies/gsense/gsense.avif', alt: 'Image 3' }],
    theme: 'dark',
    created_at: '2024-01-01T10:00:00.000Z',
    updated_at: '2024-01-02T10:00:00.000Z',
  },
  {
    id: '2',
    images: [{ id: '4', image: '/images/case-studies/gsense/gsense.avif', alt: 'Image 2' }, { id: '5', image: '/images/case-studies/gsense/gsense.avif', alt: 'Image 3' }, { id: '6', image: '/images/case-studies/gsense/gsense.avif', alt: 'Image 4' }],
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
  createCaseStudySlider: async () => {
    return mockCaseStudySliderDTOs[0];
  },
  updateCaseStudySlider: async () => {
    return mockCaseStudySliderDTOs[0];
  },
  deleteCaseStudySlider: async () => {
    return true;
  },
};
