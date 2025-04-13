'use client'

import {
  ProcessItem as ProcessItemType,
} from '@/lib/data/our-processes'
import { useState, useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'



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
  const [currentSlide, setCurrentSlide] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  // Scale effect based on scroll
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 0.9])
  // Opacity effect based on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.8, 0.6])
  // Controls dot container visibility
  const dotsOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7], // Appears when section is 30-70% in view
    [0, 1, 0]         // Fades in and out
  )

  return (
    <motion.div 
      className="relative"
      ref={containerRef}
      style={{ scale, opacity }}
    >
      <div className="overflow-hidden px-4">
        <div 
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{ 
            transform: `translateX(calc(50% - ${currentSlide * (100 / 3)}%))`,
            width: `${processItems.length * (100 / 3)}%`
          }}
        >
          {processItems.map((item: any, index: number) => (
            <div 
              key={index} 
              className={`w-1/3 flex-shrink-0 transition-opacity duration-300 ${
                Math.abs(index - currentSlide) > 1 ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <ProcessItem index={index} item={item} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation dots - now absolutely positioned */}
      <motion.div 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2 rounded-full p-16  bg-gray-400"
        style={{ opacity: dotsOpacity }}
      >
        {processItems.map((_: any, index: number) => (
          <button
            key={index+1}
            onClick={() => setCurrentSlide(index+1)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index +1 === currentSlide ? 'bg-primary' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
