export interface Service {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  contentHtml: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isPublished: boolean;
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
}