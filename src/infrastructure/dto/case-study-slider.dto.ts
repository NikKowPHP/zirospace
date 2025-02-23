export interface CaseStudySliderDTO {
  id: string;
  images: {
    id: string;
    image: string;
    alt: string;
  }[];
  created_at: string;
  updated_at: string;
} 

export interface CaseStudySliderImageDTO {
  id: string;
  slider_id: string;
  image: string;
  alt: string;
  created_at: string;
  updated_at: string;
}

