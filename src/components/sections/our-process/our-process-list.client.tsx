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
  processItems: any
}) => {
  // --- OLD CODE START ---
  // const [currentSlide, setCurrentSlide] = useState(1) // This seems related to the old logic, removing for now.
  // const containerRef = useRef<HTMLDivElement>(null)

  // // Track when section enters viewport
  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ['start end', 'end start']
  // })

  // // Scale and opacity effects
  // const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 0.9])
  // const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.8, 0.6])

  // // Dots visibility based on scroll position
  // const dotsOpacity = useTransform(
  //   scrollYProgress,
  //   [0.3, 0.5, 0.7],
  //   [0, 1, 0]
  // )
  // --- OLD CODE END ---

  // --- NEW CODE START ---
  const [currentIndex, setCurrentIndex] = useState(0); // State for the active slide index
  const containerRef = useRef<HTMLDivElement>(null) // Keep ref if needed for container measurements later
  // Note: Removed useScroll, useTransform, scale, opacity, dotsOpacity as per task requirements.
  // The old `currentSlide` state is replaced by `currentIndex`.
  // --- NEW CODE END ---

  // --- OLD CODE START ---
  // return (
  //   <motion.div
  //     className="relative"
  //     ref={containerRef}
  //     style={{ scale, opacity }} // Removed scale and opacity application
  //   >
  //     <div className="overflow-hidden px-4">
  //       <div
  //         className="flex transition-transform duration-300 ease-in-out gap-4"
  //         style={{
  //           // This transform logic seems related to the old implementation, removing for now.
  //           // transform: `translateX(calc(50% - ${currentSlide * (100 / 3)}%))`,
  //           // width: `${processItems.length * (100 / 3)}%`
  //         }}
  //       >
  //         {processItems.map((item: any, index: number) => (
  //           <div
  //             key={index}
  //             // This opacity logic also seems related to the old implementation.
  //             // className={`w-1/3 flex-shrink-0 transition-opacity duration-300 ${
  //             //   Math.abs(index - currentSlide) > 1 ? 'opacity-30' : 'opacity-100'
  //             // }`}
  //             // Simplified for now, will be part of carousel logic later.
  //             className="w-full flex-shrink-0" // Assuming items will slide, start with full width
  //           >
  //             <ProcessItem index={index} item={item} />
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {/* Viewport-fixed navigation dots - Removed as per task */}
  //     {/* <motion.div
  //       className="fixed bottom-8 left-0 right-0 flex justify-center z-50"
  //       style={{
  //         opacity: dotsOpacity,
  //         pointerEvents: scrollYProgress.get() > 0.3 && scrollYProgress.get() < 0.7 ? 'auto' : 'none'
  //       }}
  //     >
  //       <div className="bg-gray-100/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
  //         {processItems.map((_: any, index: number) => (
  //           <button
  //             key={index}
  //             onClick={() => setCurrentSlide(index)} // Should use setCurrentIndex later
  //             className={`w-3 h-3 rounded-full transition-colors mx-1 ${
  //               index === currentSlide ? 'bg-primary' : 'bg-gray-300' // Should use currentIndex later
  //             }`}
  //             aria-label={`Go to slide ${index + 1}`}
  //           />
  //         ))}
  //       </div>
  //     </motion.div> */}
  //   </motion.div>
  // )
  // --- OLD CODE END ---

  // --- NEW CODE START ---
  // Basic structure for the carousel items. Animation/sliding logic will be added in the next steps.
  return (
    <div ref={containerRef} className="relative">
      {/* Placeholder for the carousel items container */}
      <div className="flex"> {/* This will eventually hold the sliding items */}
        {processItems.map((item: any, index: number) => (
          // Render the current item based on currentIndex for now.
          // The actual sliding mechanism will replace this simple conditional rendering.
          index === currentIndex && (
            <div key={index} className="w-full flex-shrink-0">
              <ProcessItem index={index} item={item} />
            </div>
          )
        ))}
      </div>
      {/* Navigation controls will be added in subsequent tasks */}
    </div>
  )
  // --- NEW CODE END ---
}
