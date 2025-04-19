// --- FILE: src/components/sections/our-process/our-process-list.client.tsx ---
'use client'

import {
  ProcessItem as ProcessItemType,
} from '@/lib/data/our-processes'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence, useInView, animate, AnimationControls } from 'framer-motion'
import { cn } from '@/lib/utils/cn';

// --- ProcessItem component remains the same ---
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
// --- End of ProcessItem component ---


export const ProcessItemListClient = ({
  processItems,
}: {
  processItems: ProcessItemType[]
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null)
  const numItems = processItems.length;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressFillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationControlsRef = useRef<AnimationControls | null>(null);
  const [liveRegionText, setLiveRegionText] = useState('');
  // --- NEW CODE START ---
  // Ref to track if autoplay was active before hovering
  const wasPlayingBeforeHoverRef = useRef(false);
  // --- NEW CODE END ---

  useEffect(() => {
    progressFillRefs.current = progressFillRefs.current.slice(0, processItems.length);
  }, [processItems.length]);


  const isInView = useInView(containerRef, {
    margin: "-50% 0px -50% 0px"
  });

  const clearExistingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex === numItems - 1 ? 0 : prevIndex + 1;
      return nextIndex;
    });
  }, [numItems]);

  const stopAndResetProgress = useCallback(() => {
    animationControlsRef.current?.stop();
    progressFillRefs.current.forEach(ref => {
        if (ref) {
            animate(ref, { scaleX: 0 }, { duration: 0 });
        }
    });
  }, []);

  const goToPrevSlide = useCallback(() => {
    clearExistingInterval();
    stopAndResetProgress();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? numItems - 1 : prevIndex - 1
    );
  }, [numItems, clearExistingInterval, stopAndResetProgress]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < numItems && index !== currentIndex) {
      clearExistingInterval();
      stopAndResetProgress();
      setCurrentIndex(index);
    }
  }, [numItems, clearExistingInterval, stopAndResetProgress, currentIndex]);


  // Autoplay interval effect
  useEffect(() => {
    if (isPlaying && isInView) {
      clearExistingInterval();
      intervalRef.current = setInterval(goToNextSlide, 3000);
    } else {
      clearExistingInterval();
    }
    return clearExistingInterval;
  }, [isPlaying, isInView, goToNextSlide, clearExistingInterval]);

  // Progress animation effect
  useEffect(() => {
    stopAndResetProgress();
    if (isPlaying && isInView) {
        const element = progressFillRefs.current[currentIndex];
        if (element) {
            animationControlsRef.current = animate(
                element,
                { scaleX: 1 },
                { duration: 3, ease: 'linear' }
            );
        }
    }
    return () => {
        animationControlsRef.current?.stop();
    };
  }, [currentIndex, isPlaying, isInView, stopAndResetProgress]);

  // Effect to update the aria-live region text when the slide changes
  useEffect(() => {
    if (processItems[currentIndex]) {
      const timer = setTimeout(() => {
        setLiveRegionText(`Showing process step ${currentIndex + 1} of ${numItems}: ${processItems[currentIndex].title}`);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, processItems, numItems]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  // --- NEW CODE START ---
  // Handlers for pausing/resuming on hover
  const handleMouseEnter = () => {
    if (isPlaying) {
      wasPlayingBeforeHoverRef.current = true; // Remember it was playing
      setIsPlaying(false); // Pause the carousel
    }
  };

  const handleMouseLeave = () => {
    if (wasPlayingBeforeHoverRef.current) {
      setIsPlaying(true); // Resume playing
      wasPlayingBeforeHoverRef.current = false; // Reset the flag
    }
  };
  // --- NEW CODE END ---


  return (
    // --- OLD CODE START ---
    // <div ref={containerRef} className="relative">
    // --- OLD CODE END ---
    // --- NEW CODE START ---
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter} // Add mouse enter handler
      onMouseLeave={handleMouseLeave} // Add mouse leave handler
    >
    {/* --- NEW CODE END --- */}
      {/* Visually hidden container for screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveRegionText}
      </div>

      <div className="overflow-hidden">
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
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${numItems}`}
              aria-hidden={currentIndex !== index}
              id={`carousel-slide-${index}`} // Add ID for aria-controls
            >
              <ProcessItem index={index} item={item} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Fixed Controls Container with Animation */}
      <AnimatePresence>
        {isInView && (
          <motion.div
            role="tablist"
            aria-label="Process steps navigation"
            className={cn(
              "fixed bottom-8 left-1/2 -translate-x-1/2 z-50",
              "bg-white/80 backdrop-blur-sm",
              "p-3 rounded-full shadow-md",
              "flex items-center gap-x-3"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Navigation Dots */}
            <div className="flex items-center gap-x-2">
              {processItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  role="tab"
                  aria-selected={currentIndex === index}
                  id={`carousel-dot-${index}`}
                  aria-controls={`carousel-slide-${index}`} // Matches slide ID
                  className={cn(
                    "relative w-4 h-4 rounded-full transition-colors duration-200 flex items-center justify-center",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1"
                  )}
                  aria-label={`Go to process step ${index + 1}`}
                >
                  {/* Dot itself */}
                  <span className={cn(
                    "block w-2.5 h-2.5 rounded-full transition-all duration-200 ease-in-out",
                    currentIndex === index ? 'bg-primary scale-110' : 'bg-gray-400 group-hover:bg-gray-500'
                  )}></span>

                  {/* Progress Indicator Structure */}
                  {/* Track */}
                  <div className="absolute inset-0 rounded-full border-2 border-gray-300/50 pointer-events-none"></div>
                  {/* Fill */}
                  <motion.div
                    ref={el => progressFillRefs.current[index] = el}
                    className="absolute inset-0 rounded-full border-2 border-primary origin-center pointer-events-none"
                    style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent', rotate: '-90deg' }}
                    initial={{ scaleX: 0 }}
                  />
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="w-px h-4 bg-gray-300"></div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full"
              aria-label={isPlaying ? "Pause carousel autoplay" : "Play carousel autoplay"}
              aria-pressed={isPlaying}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
// --- END FILE ---