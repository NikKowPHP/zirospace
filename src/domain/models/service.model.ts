export interface Service {
  /** Unique identifier for the service. */
  id: string;
  /** URL-friendly slug for the service. */
  slug: string;
  /** Title of the service. */
  title: string;
  /** Optional subtitle for the service. */
  subtitle?: string | null;
  /** HTML content of the service. */
  contentHtml: string;
  /** Optional excerpt of the service content. */
  excerpt?: string | null;
  /** Optional URL of the service image. */
  imageUrl?: string | null;
  /** Optional alt text for the service image. */
  imageAlt?: string | null;
  /** Optional meta title for SEO. */
  metaTitle?: string | null;
  /** Optional meta description for SEO. */
  metaDescription?: string | null;
  /** Optional keywords for SEO. */
  keywords?: string[];
  /** Indicates if the service is published. */
  isPublished: boolean;
  /** Optional order index for sorting. */
  orderIndex?: number;
  /** Creation timestamp. */
  createdAt: string;
  /** Last update timestamp. */
  updatedAt: string;
}