'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { useSmoothScrollStore } from '@/hooks/use-smooth-scroll'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const setLenis = useSmoothScrollStore((state) => state.setLenis)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // direction: 'vertical',
      // gestureDirection: 'vertical',
      // smooth: true,
      // smoothTouch: false,
      touchMultiplier: 2,
    })

    setLenis(lenis)
    
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [setLenis])

  return <>{children}</>
}