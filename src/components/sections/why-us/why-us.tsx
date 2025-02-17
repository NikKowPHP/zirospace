import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

export const WhyUs = async () => {
  const t = await getTranslations('wyZiroSection')

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          Loading...
        </div>
      }
    >

     <section 
    id='why-ziro' 
     className="flex flex-col   items-center text-center   py-[100px] "
     itemScope
     itemType="https://schema.org/WebPageElement"
   >
     <div className='flex flex-col items-center text-center max-w-5xl gap-[10px] sm:gap-[12px]'>

     <h1 className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-black"
       itemProp="headline"
     >
       {t('title')}
      
     </h1>
     <p className="text-[40px] sm:text-[56px] lg:text-[48px] text-gray-700 leading-[1.2] sm:px-0">
       {t('description')}
     </p>

     </div>
   </section>
    </Suspense>
  )
}
