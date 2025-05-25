'use client'

import { create } from 'zustand'
import Lenis from 'lenis'

type SmoothScrollStore = {
  lenis: Lenis | null
  setLenis: (lenis: Lenis) => void
}

export const useSmoothScrollStore = create<SmoothScrollStore>((set) => ({
  lenis: null,
  setLenis: (lenis) => set({ lenis }),
}))

export function useSmoothScroll() {
  return useSmoothScrollStore((state) => state.lenis)
}