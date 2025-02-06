export interface CaseStudySliderDTO {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  images: {
    url: string;
    alt: string;
  }[];
  cta_text: string;
  cta_text_name: string;
  cta_url: string;
  color: string;
  background_color: string;
  theme: string;
  created_at: string;
  updated_at: string;
} 

