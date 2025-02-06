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
  readonly tags: readonly string[];
  readonly images: readonly Image[];
  readonly ctaText: string;
  readonly ctaTextName: string;
  readonly ctaUrl: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly color: string;
  readonly backgroundColor: string;
}