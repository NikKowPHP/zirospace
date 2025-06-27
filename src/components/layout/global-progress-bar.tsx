'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

import styles from './global-progress-bar.module.css'

const GlobalProgressBar = () => {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [internalPathname, setInternalPathname] = useState(pathname)

  useEffect(() => {
    if (internalPathname !== pathname) {
      // If path has changed
      setIsLoading(true)
      setProgress(30) // Start progress
      setInternalPathname(pathname) // Update internal tracker

      // Simulate progress (this is a simplification for a visual bar)
      let currentProg = 30
      const progInterval = setInterval(() => {
        currentProg += Math.random() * 10
        if (currentProg >= 90) {
          clearInterval(progInterval)
          setProgress(95) // Almost complete
          // Simulate completion
          setTimeout(() => {
            setProgress(100)
            setTimeout(() => {
              setIsLoading(false)
              setProgress(0)
            }, 300) // Short delay before hiding
          }, 200)
        } else {
          setProgress(currentProg)
        }
      }, 100)

      return () => {
        clearInterval(progInterval)
      }
    } else {
      return () => {}
    }
  }, [pathname, internalPathname])

  return (
    <div
      className={styles.progressBar}
      style={{
        width: `${progress}%`,
        display: isLoading || progress > 0 ? 'block' : 'none',
      }}
    />
  )
}

export default GlobalProgressBar
