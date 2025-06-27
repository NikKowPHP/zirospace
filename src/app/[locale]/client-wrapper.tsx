'use client'

import { Navbar } from '@/components/layout/navbar/navbar'
import { Footer } from '@/components/layout/footer/footer'
import { LanguageSwitcher } from '@/components/ui/language-switcher/language-switcher'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="bg-white w-full">
      <div className="bg-white pb-[40px] px-[20px] sm:px-0 relative">
        <Navbar />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <Footer />
        <LanguageSwitcher />
      </div>
    </div>
  )
}
