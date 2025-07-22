
import { advisorService } from '@/lib/services/advisor.service'
import { Locale } from '@/i18n'
import Image from 'next/image'

async function AdvisorsSection({ locale }: { locale: Locale }) {
  const advisors = await advisorService.getAdvisors(locale)

  if (!advisors || advisors.length === 0) {
    return null
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Advisors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {advisors.map((advisor) => (
            <div key={advisor.id} className="text-center">
              <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src={advisor.image_url}
                  alt={advisor.image_alt}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{advisor.name}</h3>
              <p className="text-gray-500">{advisor.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdvisorsSection