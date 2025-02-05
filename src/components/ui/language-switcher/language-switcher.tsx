'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface Language {
  code: string
  name: string
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polish' },
]

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  
  // Get the path segments and remove empty strings
  const segments = pathname.split('/').filter(Boolean)
  
  // First segment is always the locale if present
  const currentLang = segments[0] === 'pl' ? 'pl' : 'en'

  const handleLanguageSwitch = (targetLang: string) => {
    if (currentLang === targetLang) return

    // Remove the current locale from segments if it exists
    const pathWithoutLocale = segments[0] === 'en' || segments[0] === 'pl'
      ? segments.slice(1)
      : segments

    // Construct new path with target language
    const newPath = `/${targetLang}${pathWithoutLocale.length > 0 ? '/' + pathWithoutLocale.join('/') : ''}`
    
    router.push(newPath)
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="inline-flex rounded-full bg-gray-100 p-1">
        {languages.map((lang, index) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageSwitch(lang.code)}
            className={cn(
              'px-[20px] py-[10px] text-sm font-bold transition-all duration-200',
              // First button (English)
              index === 0 && 'rounded-full',
              // Last button (Polish)
              index === languages.length - 1 && 'rounded-full',
              currentLang === lang.code
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:text-gray-900'
            )}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  )
}
