export interface YoutubeModel {
  id: string
  youtube_url: string
}

export interface HeroModel {
  id: string
  title: string
  subtitle: string
  cta_primary_text: string
  cta_primary_link: string
  cta_secondary_text: string
  cta_secondary_link: string
  background: string
  locale: string
  created_at: Date
  updated_at: Date
}




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
  readonly orderIndex: number;
  readonly backgroundColor: string;
  readonly theme: string;
}

export interface Banner {
  id: string;
  title: string;
  content: string;
  subtitle?: string;
  imageUrl?: string;
  youtubeUrl?: string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}


export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  imageurl: string;
  createdAt: string;
  imageAlt?: string;
  excerpt: string;
  contentHtml: string;
  isPinned: boolean;
}


export interface CaseStudyImage {
  id: string
  image: string
  alt: string
  createdAt: Date
  updatedAt: Date
  sliderId?: string
}

export interface CaseStudySlider {
  id: string
  images: CaseStudyImage[]
  createdAt: Date
  updatedAt: Date
}
export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  image: string;
  image_alt: string;
  locale: string
  createdAt: Date;
  updatedAt: Date;
}
