

export interface CaseStudyImage {
  id: string;
  image: string;
  alt: string;
}

export interface CaseStudySlider {
  readonly id: string;
  images: CaseStudyImage[];
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}