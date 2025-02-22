'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button/button'
import { navigationConfig } from '@/config/navigation'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function Navbar() {
  const pathname = usePathname()
  const t = useTranslations('navigation')
  const router = useRouter();

  return (
    <header 
      className="sticky top-6 md:top-10  mx-auto   px-[10px]  max-w-full rounded-full left-0 right-0 z-50 bg-[#F7F7F7] bg-opacity-80 backdrop-blur-sm "
      itemScope 
      itemType="https://schema.org/WPHeader"
    >
      <div className=" mx-auto px-[5px]">
        <div className="flex h-[72px] items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2"
            title="ZIRO - Web Design & Development Agency"
            aria-label="ZIRO Homepage"
          >
            <Image
              src="/images/ziro.avif"
              alt="ZIRO - Professional Web Design & Development Agency"
              width={150}
              height={51}
              className="h-[36px] w-[95px]"
              priority
            />
          </Link>

          <nav 
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
            itemScope 
            itemType="https://schema.org/SiteNavigationElement"
          >
            {navigationConfig.mainNav.map((item) =>
             <Button
             variant='navbar'
             key={item.href}
             className={cn(
               'text-[16px] font-medium transition-colors',
               pathname === item.href ? 'text-gray-900' : 'text-gray-900'
             )}
             aria-label={t(item.title)}
             onClick={(e) => {

              console.log('item route and pathname', item.isRoute, pathname)
        
               if (!item.isRoute && pathname.includes('/blog')) {
                 e.preventDefault()      

                 router.push('/')
                 setTimeout(() => {
                   const element = document.getElementById(item.href)
                   element?.scrollIntoView({ behavior: 'smooth' })
                 }, 500) // Small delay to ensure the page has loaded
               } else if (!item.isRoute && !pathname.includes('/blog')) {
                 e.preventDefault()
                 const element = document.getElementById(item.href)
                 element?.scrollIntoView({ behavior: 'smooth' })
               } else if (item.isRoute) {
                router.push(item.href);
               }
             }}
           >
             {t(item.title)}
           </Button>
            )}
          </nav>


          <Button
            size="sm"
            className="rounded-full px-6 py-6 h-10 text-[15px] bg-white text-black hover:bg-white/90"
            onClick={() => {
              window.location.href = 'https://calendly.com/ziro-nikhil/30min'
            }}
            aria-label={t('bookCall')}
          >
            {t('bookCall')}
          </Button>
        </div>
      </div>
    </header>
  )
}
