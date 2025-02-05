export interface TestimonialItem {
    id: string
    author: string
    role: string
    company: string
    quote: string
    image: string
    imageAlt: string
  }
  
  export const testimonialItems: TestimonialItem[] = [

    {
        id: 'client2',
        author: 'Skand',
        role: 'testimonials.client1.role',
        company: 'testimonials.client1.company',
        quote: 'testimonials.client1.quote',
        image: '/images/client1.webp',
        imageAlt: 'testimonials.client1.imageAlt'
      },
      {
        id: 'client3',
        author: 'Vipul',
        role: 'testimonials.client1.role',
        company: 'testimonials.client1.company',
        quote: 'testimonials.client1.quote',
        image: '/images/client1.webp',
        imageAlt: 'testimonials.client1.imageAlt'
      },
      {
        id: 'client4',
        author: 'Ginny',
        role: 'testimonials.client1.role',
        company: 'testimonials.client1.company',
        quote: 'testimonials.client1.quote',
        image: '/images/client1.webp',
        imageAlt: 'testimonials.client1.imageAlt'
      },
      {
        id: 'client5',
        author: 'Skand',
        role: 'testimonials.client1.role',
        company: 'testimonials.client1.company',
        quote: 'testimonials.client1.quote',
        image: '/images/client1.webp',
        imageAlt: 'testimonials.client1.imageAlt'
      },
    // Add more testimonials
  ]
  
  export async function getTestimonials(): Promise<TestimonialItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return testimonialItems
  }