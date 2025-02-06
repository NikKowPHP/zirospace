export interface CaseStudySliderDTO {
  id: string;
  images: {
    id: string;
    image: string;
    alt: string;
  }[];
  theme: string;
  created_at: string;
  updated_at: string;
} 

