export interface ServiceDTO {
  /** Unique identifier for the service. */
  id: string;
  /** URL-friendly slug for the service. */
  slug: string;
  /** Title of the service. */
  title: string;
  /** Optional subtitle for the service. */
  subtitle?: string;
  /** HTML content of the service. */
  content_html: string;
  /** Optional excerpt of the service content. */
  excerpt?: string;
  /** Optional URL of the service image. */
  image_url?: string;
  /** Optional alt text for the service image. */
  image_alt?: string;
  /** Optional meta title for SEO. */
  meta_title?: string;
  /** Optional meta description for SEO. */
  meta_description?: string;
  /** Optional keywords for SEO. */
  keywords?: string[];
  /** Indicates if the service is published. */
  is_published: boolean;
  /** Optional order index for sorting. */
  order_index?: number;
  /** Creation timestamp. */
  created_at: string;
  /** Last update timestamp. */
  updated_at: string;
}
