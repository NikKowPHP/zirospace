export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  imageurl: string;
  createdAt: string;
  imageAlt?: string;
  excerpt: string;
  contentHtml: string;
}