import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { ContactFormYoutubeVideo } from '../footer-video/footer-video'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button/button'

export const ContactFormSection = async () => {
  const t = await getTranslations('contactUsFormSection')
  const formActionUrl = process.env.FORM_ACTION_URL

  if (!formActionUrl) {
    alert('form action is not defined')
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center mx-auto min-h-[200px]">
          Loading...
        </div>
      }
    >
      <section
        id="contact-form"
        className="flex flex-col  text-center  bg-gray-100 rounded-primary-lg max-w-5xl mx-auto p-[40px] mb-[60px]"
        itemScope
        itemType="https://schema.org/WebPageElement"
      >
        <div className="flex items-center flex-wrap  gap-[12px] sm:gap-[55px] w-full">
          <div className="flex flex-col sm:flex-row justify-between  w-full gap-[12px] sm:gap-[55px]">
            <div className="w-full sm:w-1/2">
              <ContactFormYoutubeVideo />
              <h1 className="text-[18px] text-start sm:text-[24px] lg:text-[28px] leading-[1.1] font-medium tracking-[-0.02em] text-black mb-3 mt-3">
                {t('title')}
              </h1>

              <div className="flex flex-col gap-[20px] mt-4">
                <div className="flex items-center  gap-16">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <a
                    href="mailto:nikhil@ziro.health"
                    className="text-gray-700 text-[16px] hover:text-blue-500"
                  >
                    nikhil@ziro.health
                  </a>
                </div>
                <div className="flex items-center   gap-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <a
                    href="tel:+48509654467"
                    className="text-gray-700 text-[16px] hover:text-blue-500"
                  >
                    +48 509 654 467
                  </a>
                </div>
                <div className="flex items-center   gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=UL.+Mogilska+43,+31-545,+Krakow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 text-[16px] hover:text-blue-500"
                  >
                    UL. Mogilska 43, 31-545, Krakow
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 flex flex-col items-center justify-center  ">
              <form
                className="flex flex-col items-center justify-center  w-full   gap-4 "
                action={formActionUrl}
                method="POST"
                encType="multipart/form-data"
              >
                <div className="flex flex-col items-start justify-center w-full mb-4 ">
                  <label
                    htmlFor="name"
                    className="block text-blue-500 text-sm  mb-2"
                  >
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t('namePlaceholder')}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex flex-col items-start justify-center w-full mb-4">
                  <label
                    htmlFor="email"
                    className="block text-blue-500 text-sm  mb-2"
                  >
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t('emailPlaceholder')}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex flex-col items-start justify-center w-full mb-4">
                  <label
                    htmlFor="telephone"
                    className="block text-blue-500 text-sm  mb-2"
                  >
                    {t('telephone')}
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    placeholder={t('telephonePlaceholder')}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex flex-col items-start justify-center w-full mb-4">
                  <label
                    htmlFor="message"
                    className="block text-blue-500 text-sm  mb-2"
                  >
                    {t('message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder={t('messagePlaceholder')}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 h-[100px]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full rounded-xl"
                  aria-label={t('submit')}
                >
                  {t('submit')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  )
}
