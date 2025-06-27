import { siteUrl } from '@/config/constants';

export const companyConfig = {
  name: 'ZIRO Healthcare Solutions',
  url: siteUrl,
  description:
    'Digital health solutions provider specializing in medical software development, healthcare technology innovation, and patient-centric digital products.',
  social: {
    twitter: 'https://x.com/NikhilSing69944',
    linkedin: 'https://linkedin.com/company/ziros',
    instagram: 'https://www.instagram.com/ziro.space/',
    blog: 'https://www.nikhil.health/'
  },
  calendly: 'https://calendly.com/ziro-nikhil/30min',
  expertise: [
    'Healthcare Software Development',
    'Medical Technology',
    'Digital Health Solutions',
    'Patient Experience Design',
    'Clinical Workflow Optimization'
  ],
  services: [
    'Healthcare Software Development',
    'Medical UX/UI Design',
    'Digital Health Solutions',
    'Clinical Workflow Systems'
  ],
  audience: [
    'Healthcare Providers',
    'Medical Clinics',
    'Hospitals',
    'Healthcare Professionals'
  ]
} as const