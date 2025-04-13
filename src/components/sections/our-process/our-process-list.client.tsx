'use client'

import {
  ProcessItem as ProcessItemType,
} from '@/lib/data/our-processes'



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
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] sm:gap-[20px] max-w-5xl justify-center mx-auto"
      role="list"
      aria-label="Development process steps"
    >
      {processItems.map((item: any, index: number) => (
        <ProcessItem index={index} item={item} key={index} />
      ))}
    </div>
  )
}
