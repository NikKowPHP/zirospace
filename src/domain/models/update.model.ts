export interface Update {
  id: string;
  slug: string;
  title: string;
  publish_date: Date;
  content_html: string | null;
  excerpt: string | null;
  image_url: string | null;
  image_alt: string | null;
  is_published: boolean;
  order_index: number;
  created_at: Date;
  updated_at: Date;
}