'use client'

import {
  ProcessItem as ProcessItemType,
} from '@/lib/data/our-processes'
import { useState, useRef } from 'react'
// --- OLD CODE START ---
// import { useScroll, useTransform, motion } from 'framer-motion'
// --- OLD CODE END ---
// --- NEW CODE START ---
import { motion } from 'framer-motion' // Keep motion if needed for animations later
// --- NEW CODE END ---



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
  processItems: ProcessItemType[] // Use the specific type
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null)


  // --- NEW CODE START ---
  return (
    <div ref={containerRef} className="relative overflow-hidden"> {/* Outer container with overflow hidden */}
      <motion.div
        className="flex" // Inner container that slides
        animate={{ x: `-${currentIndex * 100}%` }} // Animate translateX based on currentIndex
        transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition
      >
        {processItems.map((item, index) => (
          <div
            key={item.id || index} // Use item.id if available, otherwise index
            className="w-full flex-shrink-0 px-2" // Ensure items don't shrink and take full width, add padding if needed
            style={{ flexBasis: '100%' }} // Explicitly set flex-basis
          >
            <ProcessItem index={index} item={item} />
          </div>
        ))}
      </motion.div>
      {/* Navigation controls will be added later */}

      {/* Temporary buttons for testing sliding */}
      <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 flex gap-4 p-4 bg-black/10 rounded">
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
       </div>
    </div>
  )
  // --- NEW CODE END ---
}
// --- END FILE ---