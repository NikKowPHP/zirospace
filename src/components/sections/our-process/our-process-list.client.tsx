// --- FILE: src/components/sections/our-process/our-process-list.client.tsx ---
'use client'

import {
  ProcessItem as ProcessItemType,
} from '@/lib/data/our-processes'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence, useInView, animate, AnimationPlaybackControls } from 'framer-motion'
import { cn } from '@/lib/utils/cn';

// ProcessItem component remains the same
export const ProcessItem = ({
  index,
  item,
}: {
  index: number
  item: ProcessItemType
}) => {
    return (
    <div
      className="p-8 sm:p-12 rounded-xl bg-gray-100 shadow-sm flex flex-col gap-4 sm:gap-6 max-w-3xl mx-auto relative overflow-hidden" // Adjusted padding, max-width, gap and added mx-auto
      itemProp="step"
      itemScope
      itemType="https://schema.org/HowToStep"
    >
      {/* Background image with overlay */}
      {item.image && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10" // Reduced opacity slightly
            style={{ backgroundImage: `url(${item.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-100/80 to-transparent" /> {/* Added gradient overlay */}
        </>
      )}
      <meta itemProp="position" content={`${index + 1}`} />
      <span
        className="text-lg sm:text-xl leading-[1.2] text-primary relative z-10 font-semibold" // Adjusted size
        aria-hidden="true"
      >
        0{index + 1}
      </span>
      <h3 className="text-xl sm:text-2xl text-black relative z-10 font-medium" itemProp="name"> {/* Adjusted size */}
        {item.title}
      </h3>
      <div
        className="relative z-10"
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <ul
          className="flex flex-col gap-3 sm:gap-4" // Adjusted gap
          role="list"
          aria-label={`Steps for ${item.title}`}
        >
          {item.list.map((listItem: string, listIndex: number) => (
            <li
              key={listIndex}
              className="text-gray-700 list-disc ml-5 text-base sm:text-lg" // Adjusted size and margin
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
};
// --- End of ProcessItem component ---


export const ProcessItemListClient = ({
  processItems,
}: {
  processItems: ProcessItemType[]
}) => {
  // --- State ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveRegionText, setLiveRegionText] = useState('');

  // --- Refs ---
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressFillRefs = useRef<(HTMLDivElement | null)[]>([]); // Now used for width animation
  const animationControlsRef = useRef<AnimationPlaybackControls | null>(null);
  const wasPlayingBeforeHoverRef = useRef(false);

  // --- Constants ---
  const numItems = processItems.length;
  const AUTOPLAY_INTERVAL = 3000;
  const PROGRESS_DURATION = AUTOPLAY_INTERVAL / 1000;

  // --- Hooks ---
  const isInView = useInView(containerRef, {
    margin: "-50% 0px -50% 0px"
  });

  // --- Utility Functions ---
  const clearExistingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Stops the current progress animation and resets the width of all progress bars
   const stopAndResetProgress = useCallback(() => {
    animationControlsRef.current?.stop(); // Stop current animation if any
    // Reset all progress bars instantly
    progressFillRefs.current.forEach(ref => {
        if (ref) {
            // Use animate from framer-motion to reset instantly
            animate(ref, { width: "0%" }, { duration: 0 });
        }
    });
  }, []); // No dependencies needed as it uses refs


  // --- Navigation Functions ---
  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % numItems);
  }, [numItems]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < numItems && index !== currentIndex) {
      clearExistingInterval();
      stopAndResetProgress();
      setCurrentIndex(index);
    }
  }, [numItems, clearExistingInterval, stopAndResetProgress, currentIndex]);

  // --- Event Handlers ---
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleMouseEnter = () => {
    if (isPlaying) {
      wasPlayingBeforeHoverRef.current = true;
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (wasPlayingBeforeHoverRef.current) {
      setIsPlaying(true);
      wasPlayingBeforeHoverRef.current = false;
    }
  };

  // --- Effects ---
  useEffect(() => {
    progressFillRefs.current = progressFillRefs.current.slice(0, numItems);
  }, [numItems]);

  useEffect(() => {
    if (isPlaying && isInView) {
      clearExistingInterval();
      intervalRef.current = setInterval(goToNextSlide, AUTOPLAY_INTERVAL);
    } else {
      clearExistingInterval();
    }
    return clearExistingInterval;
  }, [isPlaying, isInView, goToNextSlide, clearExistingInterval]);

  // Progress animation effect: Manages the visual progress indicator on the active dot
  useEffect(() => {
    stopAndResetProgress(); // Reset all progress bars on slide change or play/pause

    if (isPlaying && isInView) {
        const element = progressFillRefs.current[currentIndex];
        if (element) {
            // Start animation for the current slide's progress fill
            animationControlsRef.current = animate(
                element,
                { width: "100%" }, // Animate width from 0% to 100%
                { duration: PROGRESS_DURATION, ease: 'linear' }
            );
        }
    }
    // Cleanup function to stop animation if dependencies change mid-animation
    return () => {
        animationControlsRef.current?.stop();
    };
  }, [currentIndex, isPlaying, isInView, stopAndResetProgress]); // Rerun when these change


  useEffect(() => {
    if (processItems[currentIndex]) {
      const timer = setTimeout(() => {
        setLiveRegionText(`Showing process step ${currentIndex + 1} of ${numItems}: ${processItems[currentIndex].title}`);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, processItems, numItems]);


  return (
    <div
      ref={containerRef}
      className="relative" // Keep relative for positioning controls
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveRegionText}
      </div>

      <div className="relative px-8 sm:px-16 md:px-24 lg:px-32 xl:px-40"> {/* Responsive padding */}
        <motion.div
          className="flex" // Items will arrange horizontally
          animate={{ x: `-${currentIndex * 100}%` }} // Slide based on index
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {processItems.map((item, index) => (
            <motion.div // Use motion.div for individual slide animation (opacity)
              key={item.id || index}
              className="w-full flex-shrink-0 px-2 sm:px-4" // Padding around the ProcessItem card within the slide area
              style={{ flexBasis: '100%' }} // Each slide still aims for 100% basis
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${numItems}`}
              // aria-hidden={currentIndex !== index} // Let motion handle visibility via opacity
              id={`carousel-slide-${index}`}
              animate={{ // Animate opacity based on index
                  opacity: currentIndex === index ? 1 : 0.3, // Active slide is full opacity, others are faded
                  // Optional: slightly scale down non-active slides for depth
                  // scale: currentIndex === index ? 1 : 0.95
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition for opacity/scale
            >
              {/* ProcessItem is centered within this motion.div due to its own max-w-3xl mx-auto */}
              <ProcessItem index={index} item={item} />
            </motion.div>
            // --- NEW CODE END ---
          ))}
        </motion.div>
      </div>

      {/* Controls section remains the same */}
      <AnimatePresence>
        {isInView && (
          <motion.div
            role="tablist"
            aria-label="Process steps navigation"
            className={cn(
              // span full width, then auto‑center the inner box
              "fixed bottom-8 inset-x-0 z-50",
              // shrink‑wrap & center
              "mx-auto w-max",
              // styling
              " p-10 rounded-full",
              "flex items-center gap-x-2"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Play/Pause Button */}
             <button
              onClick={togglePlayPause}
              className="flex items-center justify-center p-[20px] bg-gray-200/50 backdrop-blur-xl transition-all duration-300 rounded-full text-gray-800 hover:bg-gray-300/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-neutral-800 transition-colors"
              aria-label={isPlaying ? "Pause carousel autoplay" : "Play carousel autoplay"}
              aria-pressed={isPlaying}
            >
              {isPlaying ? <Pause className="w-full h-full" /> : <Play className="w-full h-full" />}
            </button>

            {/* Navigation Dots Area */}
            <div className="bg-gray-200/50 backdrop-blur-xl transition-all duration-300 ease-in-out rounded-full p-[10px]">
            <div className="flex items-center gap-x-1.5">
              {processItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  role="tab"
                  aria-selected={currentIndex === index}
                  id={`carousel-dot-${index}`}
                  aria-controls={`carousel-slide-${index}`}
                  className={cn(
                    "relative h-[40px] w-[40px] flex items-center justify-center px-1",
                    "focus:outline-none focus:ring-1 focus:ring-white/50 rounded-full"
                  )}
                  aria-label={`Go to process step ${index + 1}`}
                >
                  {/* Active State Background / Progress Track */}
                  {currentIndex === index && (
                    <div className="absolute inset-y-0 left-0 w-full h-full bg-neutral-300 rounded-full overflow-hidden">
                       {/* Progress Fill */}
                       <motion.div
                         ref={(el) => { progressFillRefs.current[index] = el; }}
                         className="h-full bg-white rounded-full"
                         initial={{ width: "0%" }}
                       />
                    </div>
                  )}
                  {/* Dot */}
                  <span className={cn(
                    "relative block w-2 h-2 rounded-full transition-colors duration-200 z-10",
                    currentIndex === index ? 'bg-neutral-800' : 'bg-neutral-500'
                  )}></span>
                </button>
              ))}
            </div></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
// --- END FILE ---