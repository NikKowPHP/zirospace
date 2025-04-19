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

  // --- NEW CODE START ---
  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === numItems - 1 ? 0 : prevIndex + 1
    );
  }, [numItems]); // Dependency: numItems

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? numItems - 1 : prevIndex - 1
    );
  }, [numItems]); // Dependency: numItems

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < numItems) {
      setCurrentIndex(index);
    }
  }, [numItems]); // Dependency: numItems
  // --- NEW CODE END ---


  return (
    <div ref={containerRef} className="relative overflow-hidden">
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

      {/* Temporary buttons for testing sliding */}
      {/* --- OLD CODE START --- */}
      {/* <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 flex gap-4 p-4 bg-black/10 rounded">
         <button
           onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : processItems.length - 1))}
           className="bg-white p-2 rounded-full shadow"
         >
           Prev
         </button>
         <button
           onClick={() => setCurrentIndex((prev) => (prev < processItems.length - 1 ? prev + 1 : 0))}
           className="bg-white p-2 rounded-full shadow"
         >
           Next
         </button>
       </div> */}
      {/* --- OLD CODE END --- */}
      {/* --- NEW CODE START --- */}
       <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 flex gap-4 p-4 bg-black/10 rounded">
         <button
           onClick={goToPrevSlide} // Use the new function
           className="bg-white p-2 rounded-full shadow"
           aria-label="Previous slide"
         >
           Prev
         </button>
         {/* Example usage of goToSlide (will be used by dots later) */}
         {/* {processItems.map((_, index) => (
            <button key={index} onClick={() => goToSlide(index)} className="bg-gray-300 p-1 rounded-full text-xs">{index + 1}</button>
         ))} */}
         <button
           onClick={goToNextSlide} // Use the new function
           className="bg-white p-2 rounded-full shadow"
           aria-label="Next slide"
         >
           Next
         </button>
       </div>
      {/* --- NEW CODE END --- */}
    </div>
  )
}