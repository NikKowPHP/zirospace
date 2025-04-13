'use client'

import {
  ProcessItem as ProcessItemType,
} from '@/lib/data/our-processes'
import { useState } from 'react'



export const ProcessItem = ({
  index,
  item,
}: {
  index: number
  item: ProcessItemType
}) => {
  return (
    <div
      className="p-[36px] rounded-xl bg-gray-100 shadow-sm flex flex-col gap-[16px]"
      itemProp="step"
      itemScope
      itemType="https://schema.org/HowToStep"
    >
      <meta itemProp="position" content={`${index + 1}`} />
      <span
        className="text-[16px] leading-[1.2] text-primary"
        aria-hidden="true"
      >
        0{index + 1}
      </span>
      <h3 className="text-lg text-black" itemProp="name">
        {item.title}
      </h3>
      <div
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <ul
          className="flex flex-col gap-[16px]"
          role="list"
          aria-label={`Steps for ${item.title}`}
        >
          {item.list.map((listItem: string, listIndex: number) => (
            <li
              key={listIndex}
              className="text-gray-600 list-disc ml-[16px]"
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
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {processItems.map((item: any, index: number) => (
            <div key={index} className="w-full flex-shrink-0">
              <ProcessItem index={index} item={item} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-6">
        {processItems.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
