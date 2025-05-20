export interface ServiceDTO {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content_html: string;
  excerpt?: string;
  image_url?: string;
  image_alt?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  is_published: boolean;
  order_index?: number;
  created_at: string;
  updated_at: string;
}