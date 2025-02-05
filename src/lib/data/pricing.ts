export interface PricingFeature {
  id: string
  name: string
}

export interface PricingPlan {
  id: string
  title: string
  description: string
  price: string
  pricePrefix?: string
  features: PricingFeature[]
  ctaText: string
  ctaUrl: string
  deliveryTime?: string
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'one-page',
    title: 'onePagePlan.title',
    description: 'onePagePlan.description',
    price: '990 PLN',
    features: [
      { id: '1', name: 'onePagePlan.features.delivery' },
      { id: '2', name: 'onePagePlan.features.userCentric' },
      { id: '3', name: 'onePagePlan.features.responsive' },
      { id: '4', name: 'onePagePlan.features.fastLoading' },
      { id: '5', name: 'onePagePlan.features.clearMessage' },
      { id: '6', name: 'onePagePlan.features.costEffective' },
      { id: '7', name: 'onePagePlan.features.comprehensive' },
      { id: '8', name: 'onePagePlan.features.maintenance' },
    ],
    ctaText: 'ctaText',
    ctaUrl: '/contact'
  },
  {
    id: 'multi-page',
    title: 'multiPagePlan.title',
    description: 'multiPagePlan.description',
    price: '1990 PLN',
    pricePrefix: 'from',
    features: [
      { id: '1', name: 'multiPagePlan.features.userCentric' },
      { id: '2', name: 'multiPagePlan.features.responsive' },
      { id: '3', name: 'multiPagePlan.features.fastLoading' },
      { id: '4', name: 'multiPagePlan.features.performance' },
      { id: '5', name: 'multiPagePlan.features.costEffective' },
      { id: '6', name: 'multiPagePlan.features.comprehensive' },
      { id: '7', name: 'multiPagePlan.features.maintenance' },
      { id: '8', name: 'multiPagePlan.features.support' },
    ],
    ctaText: 'ctaText',
    ctaUrl: '/contact'
  }
]

export async function getPricingPlans(): Promise<PricingPlan[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return pricingPlans
} 