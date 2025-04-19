// --- NEW FILE START ---
// File: src/components/visibility-manager.tsx
'use client'

import { useEffect, useRef, ReactNode } from 'react';
import { useVisibility } from '@/contexts/VisibilityContext';
import logger from '@/lib/logger';

interface VisibilityManagerProps {
  children: ReactNode;
  targetSectionId: string; // ID of the section to observe
}

export const VisibilityManager = ({ children, targetSectionId }: VisibilityManagerProps) => {
  const { setIsOurProcessVisible } = useVisibility();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetElementRef = useRef<Element | null>(null); // Ref to store the target element

  useEffect(() => {
    const targetElement = document.getElementById(targetSectionId);
    if (!targetElement) {
      logger.error(`VisibilityManager: Target element with ID "${targetSectionId}" not found.`);
      return;
    }
    targetElementRef.current = targetElement; // Store the element

    const options: IntersectionObserverInit = {
      root: null, // Use the viewport as the root
      rootMargin: '0px', // No margin
      threshold: 0.1, // Trigger when 10% of the element is visible
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        // logger.log(`IntersectionObserver entry for ${targetSectionId}: isIntersecting=${entry.isIntersecting}`);
        setIsOurProcessVisible(entry.isIntersecting);
      });
    };

    observerRef.current = new IntersectionObserver(callback, options);
    observerRef.current.observe(targetElement);

    // Cleanup function
    return () => {
      if (observerRef.current && targetElementRef.current) {
        // Use the stored element ref for unobserving
        observerRef.current.unobserve(targetElementRef.current);
        logger.log(`IntersectionObserver disconnected for ${targetSectionId}`);
      }
      observerRef.current?.disconnect();
    };
    // Re-run effect if targetSectionId changes (though unlikely in this case)
    // setIsOurProcessVisible is stable due to useState from context provider
  }, [targetSectionId, setIsOurProcessVisible]);

  return <>{children}</>;
};
// --- NEW FILE END ---