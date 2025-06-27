import posthog from 'posthog-js';
import { useCallback } from 'react';

export const usePosthogEvent = () => {
  const dispatchEvent = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'production') {
      posthog.capture(eventName, properties);
    }
  }, []);

  return dispatchEvent;
};

export const usePosthogClickHandler = () => {
  const dispatchEvent = usePosthogEvent();

  const clickHandler = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    return () => {
      dispatchEvent(eventName, properties);
    };
  }, [dispatchEvent]);

  return clickHandler;
};