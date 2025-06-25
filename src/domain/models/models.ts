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
  url: string
  alt: string
}

export interface CaseStudy {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly subtitle: string
  readonly description: string
  tags: readonly string[]
  readonly images: readonly Image[]
  readonly ctaUrl: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly color: string
  readonly orderIndex: number
  readonly backgroundColor: string
  readonly theme: string
}

export interface Banner {
  id: string
  title: string
  content: string
  subtitle?: string
  imageUrl?: string
  youtubeUrl?: string
  startDate?: Date
  endDate?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  ctaButtonText?: string
  ctaButtonLink?: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  image_url: string
  created_at: string
  image_alt?: string
  excerpt: string
  content_html: string
  is_pinned: boolean
}

export interface Testimonial {
  readonly id: string
  readonly author: string
  readonly role: string
  readonly company: string
  readonly quote: string
  readonly image: string
  readonly image_alt: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface CaseStudyImage {
  id: string
  image: string
  alt: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Service {
  id: string

  slug: string

  title: string

  subtitle?: string | null

  contentHtml: string

  excerpt?: string | null

  imageUrl?: string | null

  imageAlt?: string | null

  metaTitle?: string | null

  meta_description?: string | null

  keywords?: string[]

  is_published: boolean

  order_index?: number

  created_at: string

  updated_at: string
}

export interface CaseStudySlider {
  readonly id: string
  images: CaseStudyImage[]
  createdAt?: Date
  updatedAt?: Date
}
export interface Update {
  id: string
  slug: string
  title: string
  publish_date: Date
  content_html: string | null
  excerpt: string | null
  image_url: string | null
  image_alt: string | null
  is_published: boolean
  order_index: number
  created_at: Date
  updated_at: Date
}
