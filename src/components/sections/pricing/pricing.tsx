import { Button } from '@/components/ui/button/button'
import { getPricingPlans, type PricingPlan } from '@/lib/data/pricing'
import { useTranslations } from 'next-intl'

interface PricingCardProps {
  plan: PricingPlan
}

export function PricingCard({ plan }: PricingCardProps) {
  const t = useTranslations('pricing')

  return (
    <div 
      className="flex flex-col items-center p-6 sm:p-8 md:p-10 bg-white rounded-[24px] 
    sm:rounded-[32px] space-y-2 sm:space-y-6"
      itemScope 
      itemType="https://schema.org/Offer"
    >
      <meta itemProp="priceCurrency" content="PLN" />
      <meta itemProp="price" content={plan.price.toString()} />
      <h3 
        className="text-[24px] sm:text-[28px] md:text-[32px] font-medium text-center text-black"
        itemProp="name"
      >
        {t(plan.title)}
      </h3>
      
      <p className="text-sm sm:text-base text-gray-600 text-center">
        {t(plan.description)}
      </p>

      <div className="flex items-baseline gap-1">
        {plan.pricePrefix && (
          <span className="text-lg sm:text-xl text-gray-600">
            {t(plan.pricePrefix)}
          </span>
        )}
        <span className="text-[36px] sm:text-[42px] md:text-[48px] font-medium text-black">
          {plan.price}
        </span>
      </div>

      <Button
        size="lg"
        className="w-full sm:w-auto rounded-full px-8 sm:px-20 md:px-28 h-[48px] sm:h-[56px] text-[15px] sm:text-[16px] bg-[#0066FF] hover:bg-[#0066FF]/90"
      >
        {t(plan.ctaText)}
      </Button>

      <ul className="space-y-3 sm:space-y-4 pt-2 sm:pt-4 w-full">
        {plan.features.map((feature) => (
          <li 
            key={feature.id} 
            className="text-sm sm:text-base text-gray-600 text-center"
          >
            {t(feature.name)}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PricingContent({ plans }: { plans: PricingPlan[] }) {
  const t = useTranslations('pricing')

  return (
    <section 
      id="pricing" 
      className="md:mx-8 relative overflow-hidden bg-primary py-[10px]  sm:py-32 sm:pb-[60px]  md:py-24 md:pb-[60px]  rounded-primary sm:rounded-primary-lg"
    >
      <div className="container relative mx-auto px-2 sm:px-6">
        <h2 className="text-center text-[36px] sm:text-[46px] md:text-[56px] font-medium text-white mb-8 sm:mb-12 md:mb-16">
          {t('title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-full mx-auto sm:px-10">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}

export async function Pricing() {
  const plans = await getPricingPlans()
  return <PricingContent plans={plans} />
}
