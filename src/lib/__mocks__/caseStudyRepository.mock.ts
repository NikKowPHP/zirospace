// // src/lib/__mocks__/supabase.ts
// import { Locale } from '@/i18n';
// import { CaseStudyDTO } from '@/infrastructure/dto/case-study.dto';
// import { ICaseStudyRepository } from '../interfaces/caseStudyRepository.interface';
// import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper';

// // Define mock case studies data for different locales
// export const mockCaseStudyDTOs: CaseStudyDTO[] = [
//   {
//     id: '1',
//     slug: 'case-study-1',
//     title: 'Supernormal',
//     subtitle: 'Rethinking Longevity',
//     description: 'An app concept for Rejuvenation athletes powered by a health agent.',
//     tags: ['tag1', 'tag2'],
//     images: [{ url: '/images/case-studies/gsense/gsense.avif', alt: 'Image 1' }],
//     cta_text: 'View Case Study',
//     cta_text_name: 'viewCaseStudy',
//     cta_url: '/case-study-1',
//     color: '#fff',
//     background_color: '#000',
//     theme: 'dark',
//     created_at: '2024-01-01T10:00:00.000Z',
//     updated_at: '2024-01-02T10:00:00.000Z',
//   },
//   {
//     id: '2',
//     slug: 'case-study-2',
//     title: 'Case Study Two',
//     subtitle: 'Rethinking Longevity',
//     description: 'Description for case study two.',
//     tags: ['tag3', 'tag4'],
//     images: [{ url: '/images/case-studies/gsense/gsense.avif', alt: 'Image 2' }],
//     cta_text_name: 'learnMore',
//     cta_url: '/case-study-2',
//     color: '#000000',
//     background_color: '#FFFFFF',
//     theme: 'light',
//     created_at: '2024-01-05T10:00:00.000Z',
//     updated_at: '2024-01-06T10:00:00.000Z',
//   },
// ];

// // Mock Supabase client
// export const mockCaseStudyRepository: ICaseStudyRepository = {
//   getCaseStudies: async (locale: Locale) => {
//     console.log(locale)
//     return mockCaseStudyDTOs.map(CaseStudyMapper.toDomain);
//   },
//   getCaseStudyBySlug: async (slug: string, locale: Locale) => {
//     console.log(locale)
//     return mockCaseStudyDTOs.find(cs => cs.slug === slug) ? CaseStudyMapper.toDomain(mockCaseStudyDTOs.find(cs => cs.slug === slug) as CaseStudyDTO) : null;
//   },
// };
