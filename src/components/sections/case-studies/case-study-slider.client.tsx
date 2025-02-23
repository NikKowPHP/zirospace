"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CaseStudyImage, CaseStudySlider as CaseStudySliderType } from '@/domain/models/case-study-slider.model';

interface CaseStudySliderProps {
  caseStudySlider: CaseStudySliderType;
}

export function CaseStudySliderClient({ caseStudySlider }: CaseStudySliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  // Debounce utility
  const debounce = <T extends unknown[]>(func: (...args: T) => void, wait: number) => {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: T) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Check for overflow when the component mounts and on window resize
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current;
        setHasOverflow(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    const debouncedCheck = debounce(checkOverflow, 200);
    window.addEventListener('resize', debouncedCheck);
    return () => window.removeEventListener('resize', debouncedCheck);
  }, []);

  // Update arrow visibility on scroll
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const handleScroll = () => {
      const { scrollLeft, clientWidth, scrollWidth } = currentContainer;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
    };

    if (hasOverflow) {
      currentContainer.addEventListener('scroll', handleScroll);
      handleScroll();
    } else {
      setShowLeftButton(false);
      setShowRightButton(false);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasOverflow]);

  const handleScrollButtonClick = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'right' ? 400 : -400;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mx-auto max-w-5xl my-8">
      {/* Navigation buttons */}
      {showLeftButton && (
        <button
          onClick={() => handleScrollButtonClick('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {showRightButton && (
        <button
          onClick={() => handleScrollButtonClick('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex flex-nowrap gap-4 px-4">
          {caseStudySlider.images.map((image: CaseStudyImage) => (
            <div 
              key={image.id} 
              className="flex-none w-[650px]   h-full"
            >
              <Image 
                src={image.image} 
                alt={image.alt} 
                width={650} 
                height={415} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fade overlays */}
      {showLeftButton && (
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      )}
      {showRightButton && (
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      )}
    </div>
  );
}