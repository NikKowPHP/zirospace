
import { advisorService } from '@/lib/services/advisor.service'
import { Locale } from '@/i18n'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

async function AdvisorsSection({ locale }: { locale: Locale }) {
  const advisors = await advisorService.getAdvisors(locale)
  const t = await getTranslations('advisorsSection')

  if (!advisors || advisors.length === 0) {
    return null
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">{t('title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {advisors.map((advisor) => (
            <div
              key={advisor.id}
              className="rounded-primary overflow-hidden  bg-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col "
            >
              <div className="p-[15px]">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={advisor.image_url}
                    alt={advisor.image_alt}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 flex-grow">
                <h3 className="text-xl font-semibold text-gray-900">
                  {advisor.name}
                </h3>
                <p className="text-gray-600 mt-1">{advisor.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdvisorsSection
