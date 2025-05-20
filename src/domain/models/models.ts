export interface YoutubeModel {
  id: string
  youtube_url: string
}

export interface HeroModel {
  id: string
  title: string
  subtitle: string
  background_image: string | null
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

  export interface Testimonial {
    readonly id: string;
    readonly author: string;
    readonly role: string;
    readonly company: string;
    readonly quote: string;
    readonly image: string;
    readonly image_alt: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  }





export interface CaseStudyImage {
    id: string;
    image: string;
    alt: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export * from './service.model';
  
  export interface CaseStudySlider {
    readonly id: string;
    images: CaseStudyImage[];
    createdAt?: Date;
    updatedAt?: Date;
  }