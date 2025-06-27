export interface ProcessItem {
    id: string
    title: string
  list: string[]
  image: string
  }
  
  export const processItems: ProcessItem[] = [

    {
        id: 'items.item1',
        title: 'items.item1.title',
      list: ['items.item1.list.item1', 'items.item1.list.item2', 'items.item1.list.item3'],
      // image: '/images/image-service-1.png'
      image: ''
      },
      {
        id: 'items.item2',
        title: 'items.item2.title',
        list: ['items.item2.list.item1', 'items.item2.list.item2', 'items.item2.list.item3'],
        // image: '/images/image-service-2.png'
        image: ''
      },
      {
        id: 'items.item3',
        title: 'items.item3.title',
        list: ['items.item3.list.item1', 'items.item3.list.item2', 'items.item3.list.item3'],
        // image: '/images/image-service-3.png'
        image: ''
      },
      {
        id: 'items.item4',
        title: 'items.item4.title',
        list: ['items.item4.list.item1', 'items.item4.list.item2', 'items.item4.list.item3'],
        // image: '/images/image-service-1.png'
        image: ''
      },
    
    // Add more testimonials
  ]
  
  export async function getProcessItems(): Promise<ProcessItem[]> {
    return processItems
  }