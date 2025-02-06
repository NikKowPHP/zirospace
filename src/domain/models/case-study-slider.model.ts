

export interface CaseStudyImage {
  readonly id: string;
  readonly image: string;
  readonly alt: string;
}

export interface CaseStudySlider {
  readonly id: string;
  readonly images: readonly CaseStudyImage[];
  readonly theme: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}