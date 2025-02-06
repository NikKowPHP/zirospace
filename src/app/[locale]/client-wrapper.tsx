'use client'

import { Navbar } from '@/components/layout/navbar/navbar'
import { Footer } from '@/components/layout/footer/footer'
import { LanguageSwitcher } from '@/components/ui/language-switcher/language-switcher'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-white border border-red-500 pb-[40px] md:container relative'>
      <Navbar />
      {children}
        <Footer />
      <LanguageSwitcher />
    </div>
  )
}

