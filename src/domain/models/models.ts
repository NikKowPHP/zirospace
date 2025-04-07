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
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  images: Image[];
  cta_text: string; // Added from Prisma
  cta_text_name: string; // Added from Prisma
  cta_url: string; // Renamed from ctaUrl to match Prisma
  created_at: Date; // Renamed from createdAt to match Prisma
  updated_at: Date; // Renamed from updatedAt to match Prisma
  color: string;
  order_index: number;
  background_color: string;
  theme: string;
  locale: string;
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
  locale: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  image_url: string; // Matched Prisma: image_url
  created_at: Date; // Matched Prisma: created_at (DateTime -> Date)
  image_alt: string | null; // Matched Prisma: image_alt (String? -> string | null)
  excerpt: string;
  content_html: string; // Matched Prisma: content_html
  is_pinned: boolean; // Matched Prisma: is_pinned
  locale: string; // Added from Prisma

}


export interface CaseStudyImage {
  id: string
  image: string
  alt: string
  created_at: Date
  updated_at: Date
  sliderId?: string
}

export interface CaseStudySlider {
  id: string
  images: CaseStudyImage[]
  created_at: Date
  updated_at: Date
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
  created_at: Date
  updated_at: Date
}
