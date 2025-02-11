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