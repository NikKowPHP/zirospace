export interface BlogPostDTO {
  id: string;
  slug: string;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  image_alt?: string;
  excerpt: string;
  content_html: string;
  is_pinned: boolean;
}