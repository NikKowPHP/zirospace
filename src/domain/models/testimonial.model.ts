export interface Testimonial {
  readonly id: string;
  readonly author: string;
  readonly role: string;
  readonly company: string;
  readonly quote: string;
  readonly image: string;
  readonly image_alt: string;
  readonly order_index?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}