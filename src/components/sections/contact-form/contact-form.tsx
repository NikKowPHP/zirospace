import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { FooterVideo } from '../float-video/footer-video'

export const ContactFormSection = async () => {
  const t = await getTranslations('contactUsFormSection')

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center mx-auto min-h-[200px]">
          Loading...
        </div>
      }
    >

      <section
        id='contact-form'
        className="flex flex-col   items-center text-center   py-[100px] "
        itemScope
        itemType="https://schema.org/WebPageElement"
      >
        <div className='flex items-center flex-wrap max-w-3xl gap-[12px] sm:gap-[55px]'>

          <div className='w-full sm:w-1/2' >
            { /* TODO: youtube section */}
            <div className='border border-red-500 h-[300px]'><FooterVideo /></div>
            <h1 className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-black"
              itemProp="headline"
            >

              {t('title')}

            </h1>

            <div className='flex flex-col gap-[20px]' >
              <div className='flex items-center justify-center' >
                <span >Icon </span>
                <a href="mailto:nikhil@ziro.space">nikhil@ziro.space</a>
              </div>
              <div className='flex items-center justify-center' >
                <span >Icon </span>
                <a href="tel:+48509654467">+48 509 654 467</a>
              </div>
              <div className='flex items-center justify-center' >
                <span >Icon </span>
                <a href="https://www.google.com/maps/search/?api=1&query=UL.+Mogilska+43,+31-545,+Krakow" target="_blank" rel="noopener noreferrer">UL. Mogilska 43, 31-545, Krakow</a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </Suspense>
  )
}
