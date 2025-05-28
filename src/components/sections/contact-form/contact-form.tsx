import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { FooterVideo } from '../float-video/footer-video'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button/button'

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
              <div className='flex items-center justify-center gap-2' >
                <Mail className="w-5 h-5" />
                <a href="mailto:nikhil@ziro.space">nikhil@ziro.space</a>
              </div>
              <div className='flex items-center justify-center gap-2' >
                <Phone className="w-5 h-5" />
                <a href="tel:+48509654467">+48 509 654 467</a>
              </div>
              <div className='flex items-center justify-center gap-2' >
                <MapPin className="w-5 h-5" />
                <a href="https://www.google.com/maps/search/?api=1&query=UL.+Mogilska+43,+31-545,+Krakow" target="_blank" rel="noopener noreferrer">UL. Mogilska 43, 31-545, Krakow</a>
              </div>
            </div>

            <div className='flex flex-col items-center justify-center  w-full'>
              <form className='flex flex-col items-center justify-center  w-full'>
                <div className='flex flex-col items-start justify-center w-full'>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t('name')}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className='flex flex-col items-start justify-center w-full'>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    {t('email')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t('name')}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className='flex flex-col items-start justify-center w-full'>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    {t('telephone')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t('name')}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className='flex flex-col items-start justify-center w-full'>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    {t('message')}
                  </label>
                  <textarea
                    id="name"
                    name="message"
                    placeholder={t('message')}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <Button variant="primary"
                  className='w-full '
                >
                  {t('submit')}
                </Button>

              </form>
            </div>

          </div>

        </div>
      </section>
    </Suspense >
  )
}
