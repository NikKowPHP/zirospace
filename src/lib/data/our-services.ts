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


  {
    id: 'serviceCard4.title',
    title: 'serviceCard4.title',
    subtitle: 'serviceCard4.subtitle',
    description: 'serviceCard4.description',
    image_url: '/images/image-service-5.webp',
  },
  {
    id: 'serviceCard5.title',
    title: 'serviceCard5.title',
    subtitle: 'serviceCard5.subtitle',
    description: 'serviceCard5.description',
    image_url: '/images/image-service-4.jpg',
  },
  {
    id: 'serviceCard6.title',
    title: 'serviceCard6.title',
    subtitle: 'serviceCard6.subtitle',
    description: 'serviceCard6.description',
    image_url: '/images/image-service-6.jpg',
  },
]

export async function getServiceItems(): Promise<ServiceItem[]> {
  return serviceItems
}

