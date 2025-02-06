export interface ServiceItem {
    id: string
    title: string
    subtitle: string
    description: string
}
  

  
  export const serviceItems: ServiceItem[] = [

    {
        id: 'serviceCard1.title',
      title: 'serviceCard1.title',
        subtitle: 'serviceCard1.subtitle',
        description: 'serviceCard1.description'
      },
      {
        id: 'serviceCard2.title',
        title: 'serviceCard2.title',
        subtitle: 'serviceCard2.subtitle',
        description: 'serviceCard2.description'
      },
      {
        id: 'serviceCard3.title',
        title: 'serviceCard3.title',
          subtitle: 'serviceCard3.subtitle',
        description: 'serviceCard3.description'
      },
    
    // Add more testimonials
  ]
  
  export async function getServiceItems(): Promise<ServiceItem[]> {
    return serviceItems
  }