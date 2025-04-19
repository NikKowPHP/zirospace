'use client'

import {
  ProcessItem as ProcessItemType,
} from '@/lib/data/our-processes'
// --- OLD CODE START ---
// import { useState, useRef } from 'react'
// --- OLD CODE END ---
// --- NEW CODE START ---
import { useState, useRef, useCallback } from 'react' // Added useCallback
// --- NEW CODE END ---
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'


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


export const ProcessItemListClient = ({
  processItems,
}: {
  processItems: ProcessItemType[]
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null)
  const numItems = processItems.length;

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


  // --- OLD CODE START ---
  // return (
  //   <div ref={containerRef} className="relative overflow-hidden">
  //     <motion.div
  //       className="flex"
  //       animate={{ x: `-${currentIndex * 100}%` }}
  //       transition={{ duration: 0.5, ease: "easeInOut" }}
  //     >
  //       {processItems.map((item, index) => (
  //         <div
  //           key={item.id || index}
  //           className="w-full flex-shrink-0 px-2"
  //           style={{ flexBasis: '100%' }}
  //         >
  //           <ProcessItem index={index} item={item} />
  //         </div>
  //       ))}
  //     </motion.div>

  //      <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 flex gap-4 p-4 bg-black/10 rounded">
  //        <button
  //          onClick={goToPrevSlide} // Use the new function
  //          className="bg-white p-2 rounded-full shadow"
  //          aria-label="Previous slide"
  //        >
  //          Prev
  //        </button>
  //        <button
  //          onClick={goToNextSlide} // Use the new function
  //          className="bg-white p-2 rounded-full shadow"
  //          aria-label="Next slide"
  //        >
  //          Next
  //        </button>
  //      </div>
  //   </div>
  // )
  // --- OLD CODE END ---

  // --- NEW CODE START ---
  return (
    <div className="relative"> {/* Removed overflow-hidden from here */}
      <div ref={containerRef} className="overflow-hidden"> {/* Added overflow-hidden here */}
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {processItems.map((item, index) => (
            <div
              key={item.id || index}
              className="w-full flex-shrink-0 px-2" // Added px-2 for spacing between slides
              style={{ flexBasis: '100%' }}
            >
              <ProcessItem index={index} item={item} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Fixed Controls Container */}
      <div
        className={cn(
          "fixed bottom-8 left-1/2 -translate-x-1/2 z-50", // Positioning
          "bg-white/80 backdrop-blur-sm", // Background & Blur
          "p-3 rounded-full shadow-md", // Padding, Shape, Shadow
          "flex items-center gap-x-3" // Layout for children (dots, play/pause)
        )}
      >
        {/* Placeholder for controls - Dots and Play/Pause button will go here */}
        <span className="text-xs text-gray-500">Controls Placeholder</span>
      </div>

      {/* Remove temporary buttons after verification */}
      {/* <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 flex gap-4 p-4 bg-black/10 rounded">
         <button onClick={goToPrevSlide} className="bg-white p-2 rounded-full shadow" aria-label="Previous slide">Prev</button>
         <button onClick={goToNextSlide} className="bg-white p-2 rounded-full shadow" aria-label="Next slide">Next</button>
       </div> */}
    </div>
  )
  // --- NEW CODE END ---
}
// --- END FILE ---
