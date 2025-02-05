'use client'

import { Header } from '@/components/layout/header/header'
import { Footer } from '@/components/layout/footer/footer'
import { LanguageSwitcher } from '@/components/ui/language-switcher/language-switcher'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-white px-[20px] pb-[40px]'>
      <Header />
      {children}
      <div className=' md:px-14'>
        <Footer />
      </div>
      <LanguageSwitcher />
    </div>
  )
}

