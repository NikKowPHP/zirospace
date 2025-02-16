export interface Image {
  url: string;
  alt: string;
}

export interface CaseStudy {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  tags: readonly string[];
  readonly images: readonly Image[];
  readonly ctaUrl: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly color: string;
  readonly backgroundColor: string;
  readonly theme: string;
}