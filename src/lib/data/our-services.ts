export interface ServiceItem {
  id: string
  title: string
  subtitle: string
  description: string
  image_url: string
}

export const serviceItems: ServiceItem[] = [
  {
    id: 'serviceCard1.title',
    title: 'serviceCard1.title',
    subtitle: 'serviceCard1.subtitle',
    description: 'serviceCard1.description',
    image_url: '/images/image-service-1.png',
  },
  {
    id: 'serviceCard2.title',
    title: 'serviceCard2.title',
    subtitle: 'serviceCard2.subtitle',
    description: 'serviceCard2.description',
    image_url: '/images/image-service-2.png',
  },
  {
    id: 'serviceCard3.title',
    title: 'serviceCard3.title',
    subtitle: 'serviceCard3.subtitle',
    description: 'serviceCard3.description',
    image_url: '/images/image-service-3.png',
  },

  // Add more testimonials
]

export async function getServiceItems(): Promise<ServiceItem[]> {
  return serviceItems
}

