

export interface CaseStudyImage {
  id: string;
  image: string;
  alt: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CaseStudySlider {
  readonly id: string;
  images: CaseStudyImage[];
  createdAt?: Date;
  updatedAt?: Date;
}