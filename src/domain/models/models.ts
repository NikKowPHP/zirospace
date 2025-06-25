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
   id: string
   slug: string
   title: string
   subtitle: string
   description: string
  tags:  string[]
   images:  Image[]
   cta_url: string
   created_at: string
   updated_at: string
   color: string
  cta_text_name: string
   order_index: number
   theme: string
}

export interface Banner {
  id: string
  title: string
  content: string
  subtitle?: string
  image_url?: string
  youtube_url?: string
  start_date?: Date
  end_date?: Date
  is_active: boolean
  created_at: string
  updated_at: string
  cta_button_text?: string
  cta_button_link?: string
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
   id: string
   author: string
   role: string
   company: string
   quote: string
   image: string
   image_alt: string
   created_at: string
   updated_at: string
}

export interface CaseStudyImage {
  id: string
  image: string
  alt: string
  created_at?: string
  updated_at?: string
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
   id: string
  images: CaseStudyImage[]
  created_at?: string
  updated_at?: string
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
  created_at: string
  updated_at: string
}
