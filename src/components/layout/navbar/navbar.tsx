'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button/button'
import { navigationConfig } from '@/config/navigation'
import { cn } from '@/lib/utils/cn'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { usePosthogEvent } from '@/hooks/use-posthog'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const t = useTranslations('navigation')
  const router = useRouter()
  const dispatchEvent = usePosthogEvent()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavbarClick = (
    e: React.MouseEvent,
    item: { href: string; isRoute: boolean },
    pathname: string,
    isMobile = false
  ) => {
    console.log('item route and pathname', item.isRoute, pathname)

    dispatchEvent('navbar_click', {
      item_href: item.href,
      is_route: item.isRoute,
      current_path: pathname,
    })

    if (!item.isRoute && pathname.includes('/blog')) {
      e.preventDefault()
      router.push('/')
      setTimeout(() => {
        const element = document.getElementById(item.href)
        element?.scrollIntoView({ behavior: 'smooth' })
        if (isMobile) {
          setIsMobileMenuOpen(false)
        }
      }, 500) // Small delay to ensure the page has loaded
    } else if (!item.isRoute && !pathname.includes('/blog')) {
      e.preventDefault()
      const element = document.getElementById(item.href)
      element?.scrollIntoView({ behavior: 'smooth' })
      if (isMobile) {
        setIsMobileMenuOpen(false)
      }
    } else if (item.isRoute) {
      router.push(item.href)
    }
  }

  const handleHamburgerClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header
      className={`sticky top-[20px] mx-auto px-[10px] max-w-5xl left-0 right-0 z-50 bg-[#F7F7F7] bg-opacity-80 backdrop-blur-sm transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'rounded-[40px]' : 'rounded-[50px]'
      }`}
      itemScope
      itemType="https://schema.org/WPHeader"
    >
      <div className=" mx-auto px-[5px]">
        <div
          className={`flex min-h-[72px] items-center justify-between overflow-hidden duration-300 ease-in-out `}
        >
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

          {/*  desktop nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            {navigationConfig.mainNav.map((item) => (
              <Button
                variant="navbar"
                key={item.href}
                className={cn(
                  'text-[16px] font-medium transition-colors',
                  pathname === item.href ? 'text-gray-900' : 'text-gray-900'
                )}
                aria-label={t(item.title)}
                onClick={(e) => {
                  handleNavbarClick(e, item, pathname)
                }}
              >
                {t(item.title)}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-[20px]">
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

            {/* hamburger menu */}
            <button
              onClick={handleHamburgerClick}
              className="flex flex-col justify-center gap-[6px] items-center md:hidden"
            >
              <span
                className={`bg-black block transition-all duration-500 [transition-timing-function:cubic-bezier(0.68,-0.55,0.27,1.55)] 
                    h-0.5 w-6 rounded-sm ${
                      isMobileMenuOpen
                        ? 'rotate-45 translate-y-1'
                        : '-translate-y-0.5'
                    }`}
              ></span>
              <span
                className={`bg-black block transition-all duration-500 [transition-timing-function:cubic-bezier(0.68,-0.55,0.27,1.55)] 
                    h-0.5 w-6 rounded-sm ${
                      isMobileMenuOpen
                        ? '-rotate-45 -translate-y-1'
                        : 'translate-y-0.5'
                    }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden w-full overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[500px] rounded-b-[50px]' : 'max-h-0'
          }`}
          style={{
            background: 'inherit',
            backdropFilter: 'inherit',
          }}
        >
          <nav
            className="flex flex-col items-center gap-4 py-6"
            aria-label="Mobile navigation"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            {navigationConfig.mainNav.map((item) => (
              <div className='flex  '>

              <Button
                variant="navbar"
                key={item.href}
                className={cn(
                  ' text-[16px] font-medium w-full text-center p-[20px] hover:bg-white transition-colors duration-200',
                  pathname === item.href ? 'text-gray-900' : 'text-gray-900'
                )}
                aria-label={t(item.title)}
                onClick={(e) => {
                  handleNavbarClick(e, item, pathname, true)
                }}
              >
                {t(item.title)}
              </Button>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
