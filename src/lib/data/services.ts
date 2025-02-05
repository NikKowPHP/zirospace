export interface Service {
    id: string;
    name: string;
  }
  
  export const services: Service[] = [
    { id: '1', name: 'Web Design' },
    { id: '2', name: '3D Graphics' },
    { id: '3', name: 'Animations' },
    { id: '4', name: 'Logo Design' },
    { id: '5', name: 'Branding' },
    { id: '6', name: 'Illustrations' },
    { id: '7', name: 'Web Design' },
    { id: '8', name: '3D Graphics' },
    { id: '9', name: 'Animations' },
  ]
  
  export async function getServices(): Promise<Service[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return services
  }