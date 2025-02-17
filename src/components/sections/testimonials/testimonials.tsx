'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Testimonial } from '@/domain/models/testimonial.model'

// Define the props for the Testimonials component
interface TestimonialsProps {
  testimonials: Testimonial[];
}

// Update the Testimonials component to accept testimonials as props
export function Testimonials({ testimonials }: TestimonialsProps) {
  const t = useTranslations('testimonials')
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)

  
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const hasHorizontalScroll = 
          containerRef.current.scrollWidth > containerRef.current.clientWidth
        setHasOverflow(hasHorizontalScroll)
      }
    }
    
    checkOverflow()
    window.addEventListener('resize', debounce(checkOverflow, 200))
    return () => window.removeEventListener('resize', debounce(checkOverflow, 200))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (currentContainerRef) {
        const { scrollLeft, clientWidth, scrollWidth } = currentContainerRef;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
      }
    };
    const currentContainerRef = containerRef.current;

    if (currentContainerRef && hasOverflow) {
      currentContainerRef?.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => {
        if(currentContainerRef) {
          currentContainerRef.removeEventListener('scroll', handleScroll);
        }
      };
    } else {
      setShowLeftButton(false);
      setShowRightButton(false);
      return () => {
        if(currentContainerRef) {
          currentContainerRef.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [hasOverflow]);


  const handleScrollButtonClick = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'right' ? 400 : -400;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  const debounce = <T extends unknown[]>(func: (...args: T) => void, wait: number) => {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: T) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  return (
    <section className="py-[100px] relative   ">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center mb-10 sm:mb-12 gap-[12px]">

          <h2 className="text-[40px] sm:text-[56px] lg:text-[48px] leading-[1.1] font-medium tracking-[-0.02em] text-primary">
            {t('title')}
          </h2>
          <h3 className='text-gray-500 text-[18px] sm:text-[20px]'>
            {t('description')}
          </h3>
        </div>

        <div className="relative group">
          <div 
            ref={containerRef}
            className="flex overflow-x-auto pb-8 gap-6 scrollbar-hide scrollbar-w-0 relative"
            style={{ 
              scrollbarWidth: 'none',  // Firefox
              msOverflowStyle: 'none'  // IE/Edge
            }}
          >
            {testimonials.map((testimonial: Testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-[300px] sm:w-[400px] sm:h-[250px] bg-gray-100 rounded-[32px] p-6"
              >
                <div className="space-y-6 flex flex-col h-full">
                  <p className="text-gray-900 text-lg leading-relaxed flex-1">
                    &quot;{(testimonial.quote).trim()}&quot;
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.image_alt}
                        width={48}
                        height={48}
                        className="object-cover h-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role},{' '}
                        {/* 'my role' */}
                        {testimonial.company}
                        {/* 'my company' */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
         {/* Scroll fade Left */}
         {showLeftButton && (
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          )}

          {/* Scroll fade Right */}
          {showRightButton && (
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          )}
          
          {/* Navigation buttons */}
           {/* Navigation buttons */}
           {showLeftButton && (
            <button
              onClick={() => handleScrollButtonClick('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {showRightButton && (
            <button
              onClick={() => handleScrollButtonClick('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
