import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer() {
  const t = useTranslations('footer')
  
  return (
    <footer 
      className="bg-gray-50  md:container  rounded-primary-lg py-12 px-2 sm:py-18  sm:px-20"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <Image
              src="/images/ziro.avif"
              alt="ZIRO - Web Design & Development Agency"
              width={100}
              height={34}
              className="h-[34px] w-auto"
              itemProp="logo"
            />
            
            {/* Social Links */}
            <div className="flex gap-2">
              <div className="bg-gray-200 p-2 rounded-lg">
                <Link 
                  href="https://instagram.com/ziro.agency" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 text-gray-600 hover:text-gray-900 transition-opacity"
                >
                  <Image src="/images/instagram.svg" alt="Instagram" width={24} height={24} />
                </Link>
              </div>
              <div className="bg-gray-200 text-gray-900 p-2 rounded-lg">
                <Link 
                  href="https://linkedin.com/company/ziros" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                 <Image src="/images/linkedin.svg" alt="LinkedIn" width={24} height={24} />
                </Link>
              </div>
            </div>

            {/* Poland Flag and Text */}
            <div className="flex items-center gap-2">
              <Image
                src="/images/pl.svg"
                alt="Polish Flag"
                width={24}
                height={16}
                className="w-6 h-[20px]"
              />
              <span className="text-sm text-gray-600">
                {t('designedWith')}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-xs max-w-md">
              {t('description')}
            </p>

         
          </div>

          {/* Right Column - Links */}
          <div className="lg:col-span-6 flex flex-wrap gap-x-12 gap-y-8 mt-12">
            <div>
              <h3 className="font-medium text-gray-900 whitespace-nowrap">
                {t('links.company')}
              </h3>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 whitespace-nowrap">
                {t('links.terms')}
              </h3>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 whitespace-nowrap">
                {t('links.press')}
              </h3>
            </div>
          </div>
        </div>

        <meta itemProp="name" content="ZIRO" />
        <meta itemProp="description" content="Professional Web Design & Development Agency" />
        <meta itemProp="url" content="https://ziro.agency" />
      </div>
    </footer>
  )
}
