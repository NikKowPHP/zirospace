export interface Image {
  url: string;
  alt: string;
}

export interface CaseStudySlider {
  readonly id: string;
  readonly images: readonly Image[];
  readonly theme: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}