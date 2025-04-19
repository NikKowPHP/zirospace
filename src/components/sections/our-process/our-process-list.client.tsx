// --- FILE: src/components/sections/our-process/our-process-list.client.tsx ---
'use client'

import {
  ProcessItem as ProcessItemType,
} from '@/lib/data/our-processes'
// --- OLD CODE START ---
// import { useState, useRef, useCallback } from 'react'
// import { motion } from 'framer-motion'
// --- OLD CODE END ---
// --- NEW CODE START ---
import { useState, useRef, useCallback, useEffect } from 'react' // Added useEffect
import { motion, AnimatePresence, useInView } from 'framer-motion' // Added AnimatePresence, useInView
// --- NEW CODE END ---
import { cn } from '@/lib/utils/cn';

// --- ProcessItem component remains the same ---
export const ProcessItem = ({
  index,
  item,
}: {
  index: number
  item: ProcessItemType
}) => {
  return (
    <div
      className="p-[48px] rounded-xl bg-gray-100 shadow-sm flex flex-col gap-[24px] max-w-4xl relative overflow-hidden"
      itemProp="step"
      itemScope
      itemType="https://schema.org/HowToStep"
    >
      {/* Background image with overlay */}
      {item.image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${item.image})` }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </>
      )}
      <meta itemProp="position" content={`${index + 1}`} />
      <span
        className="text-[20px] leading-[1.2] text-primary relative z-10"
        aria-hidden="true"
      >
        0{index + 1}
      </span>
      <h3 className="text-xl text-black relative z-10" itemProp="name">
        {item.title}
      </h3>
      <div
        className="relative z-10"
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <ul
          className="flex flex-col gap-[20px]"
          role="list"
          aria-label={`Steps for ${item.title}`}
        >
          {item.list.map((listItem: string, listIndex: number) => (
            <li
              key={listIndex}
              className="text-gray-700 list-disc ml-[20px] text-lg"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/HowToDirection"
            >
              <span itemProp="text">{listItem}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
// --- End of ProcessItem component ---


export const ProcessItemListClient = ({
  processItems,
}: {
  processItems: ProcessItemType[]
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null) // Ref for the main container
  const numItems = processItems.length;

  // --- NEW CODE START ---
  // Hook to track if the main container is in view
  const isInView = useInView(containerRef, {
    margin: "-50% 0px -50% 0px" // Trigger when the center of the element is in the center of the viewport
    // amount: 0.5 // Alternative: Trigger when 50% is visible
  });
  // --- NEW CODE END ---


  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === numItems - 1 ? 0 : prevIndex + 1
    );
  }, [numItems]);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? numItems - 1 : prevIndex - 1
    );
  }, [numItems]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < numItems) {
      setCurrentIndex(index);
    }
  }, [numItems]);


  return (
    // --- OLD CODE START ---
    // <div className="relative">
    // --- OLD CODE END ---
    // --- NEW CODE START ---
    <div ref={containerRef} className="relative"> {/* Attach ref here */}
    {/* --- NEW CODE END --- */}
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {processItems.map((item, index) => (
            <div
              key={item.id || index}
              className="w-full flex-shrink-0 px-2"
              style={{ flexBasis: '100%' }}
            >
              <ProcessItem index={index} item={item} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- OLD CODE START --- */}
      {/* Fixed Controls Container */}
      {/* <div
        className={cn(
          "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
          "bg-white/80 backdrop-blur-sm",
          "p-3 rounded-full shadow-md",
          "flex items-center gap-x-2"
        )}
      > */}
        {/* Navigation Dots */}
        {/* <div className="flex items-center gap-x-2">
          {processItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-200 ease-in-out",
                currentIndex === index
                  ? 'bg-primary scale-110 ring-2 ring-primary/50 ring-offset-1 ring-offset-white/80'
                  : 'bg-gray-400 hover:bg-gray-500'
              )}
              aria-label={`Go to process step ${index + 1}`}
              aria-current={currentIndex === index ? 'step' : undefined}
            />
          ))}
        </div> */}
      {/* </div> */}
      {/* --- OLD CODE END --- */}

      {/* --- NEW CODE START --- */}
      {/* Fixed Controls Container with Animation */}
      <AnimatePresence>
        {isInView && ( // Conditionally render based on isInView
          <motion.div
            className={cn(
              "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
              "bg-white/80 backdrop-blur-sm",
              "p-3 rounded-full shadow-md",
              "flex items-center gap-x-2"
            )}
            initial={{ opacity: 0, y: 20 }} // Start hidden and slightly down
            animate={{ opacity: 1, y: 0 }} // Fade in and slide up
            exit={{ opacity: 0, y: 20 }} // Fade out and slide down
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Navigation Dots */}
            <div className="flex items-center gap-x-2">
              {processItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-200 ease-in-out",
                    currentIndex === index
                      ? 'bg-primary scale-110 ring-2 ring-primary/50 ring-offset-1 ring-offset-white/80'
                      : 'bg-gray-400 hover:bg-gray-500'
                  )}
                  aria-label={`Go to process step ${index + 1}`}
                  aria-current={currentIndex === index ? 'step' : undefined}
                />
              ))}
            </div>
            {/* Placeholder for Play/Pause button */}
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- NEW CODE END --- */}

    </div>
  )
}
// --- END FILE ---