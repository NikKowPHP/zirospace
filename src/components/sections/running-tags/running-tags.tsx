'use client'

import { type Service } from '@/lib/data/services'
import { useEffect, useRef } from 'react'

interface RunningTagsProps {
  services: Service[]
  speed?: number
}

export function RunningTags({ services, speed = 50 }: RunningTagsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const scrollerInnerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollerRef.current || !scrollerInnerRef.current) return

    const scrollerContent = Array.from(scrollerInnerRef.current.children)
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true)
      if (scrollerInnerRef.current) {
        scrollerInnerRef.current.appendChild(duplicatedItem)
      }
    })

    const scrollerInner = scrollerInnerRef.current
    const scrollingAnimation = scrollerInner.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(-${scrollerContent[0].clientWidth}px)` },
      ],
      {
        duration: scrollerContent[0].clientWidth * speed,
        iterations: Infinity,
      }
    )

    return () => {
      scrollingAnimation.cancel()
    }
  }, [speed])

  return (
    <div
      ref={scrollerRef}
      className="max-w-[100vw] overflow-hidden rounded-full bg-black py-8"
      itemScope 
      itemType="https://schema.org/ItemList" 
    >
      <div
        ref={scrollerInnerRef}
        className="flex min-w-full shrink-0 gap-8 py-4"
      >
        {services.map((service, index) => (
          <span
            key={service.id}
            className="flex-shrink-0 py-6 text-[24px] font-normal text-sm text-white"
            itemProp="itemListElement"
            itemScope 
            itemType="https://schema.org/Service"
          >
             <meta itemProp="position" content={String(index + 1)} />
             <span itemProp="name">{service.name}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
