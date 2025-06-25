export interface CaseStudy {
  id: string
  slug: string
  title: string
  subtitle?: string
  description?: string
  images?: any // JSON type
  tags: string[]
  cta_text: string
  cta_text_name: string
  cta_url?: string
  color?: string
  background_color?: string
  theme?: string
  order_index?: number
  created_at?: Date
  updated_at?: Date
}