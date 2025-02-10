import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { footerConfig } from '@/config/footer'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer
      className="bg-gray-50 w-full  border border-red-500  rounded-primary-lg py-12 px-2 sm:py-18  sm:px-20"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="max-w-5xl mx-auto">
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


            {/* Poland Flag and Text */}
            <div className="flex items-center gap-2">
              <Image
                src="/images/pl.svg"
                alt="Polish Flag"
                width={24}
                height={16}
                className="w-6 h-[20px]"
              />
              <span className="text-sm text-gray-600">{t('designedWith')}</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-xs max-w-md">{t('description')}</p>
          </div>

          {/* Right Column - Links */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-12  mt-12 border border-red-500">
            <div className="flex flex-col gap-4">
              {footerConfig.mainNav.map((item, index) => (
                <div key={index}>
                  <Link href={item.href} className="font-medium text-gray-900 text-[14px] whitespace-nowrap hover:opacity-80 transition-opacity">
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {footerConfig.socialLinks.map((item, index) => (
                <div key={index}>
                  <Link href={item.href} className="font-medium text-gray-900 text-[14px] whitespace-nowrap hover:opacity-80 transition-opacity">
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <meta itemProp="name" content="ZIRO" />
        <meta
          itemProp="description"
          content="Professional Web Design & Development Agency"
        />
        <meta itemProp="url" content="https://ziro.agency" />
      </div>
    </footer>
  )
}
