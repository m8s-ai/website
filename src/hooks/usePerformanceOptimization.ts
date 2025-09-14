import { useCallback, useMemo, useRef } from 'react';

/**
 * Performance optimization hook that provides debouncing and memoization utilities
 */
export const usePerformanceOptimization = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced callback helper
  const createDebouncedCallback = useCallback(<T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number
  ): T => {
    return ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T;
  }, []);

  // Throttled callback helper
  const createThrottledCallback = useCallback(<T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number
  ): T => {
    let lastCall = 0;
    
    return ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCall >= delay) {
        lastCall = now;
        return callback(...args);
      }
    }) as T;
  }, []);

  // Memoized analytics tracking
  const createAnalyticsTracker = useCallback((eventType: string, baseData: Record<string, unknown>) => {
    const tracker = useMemo(() => ({
      track: (additionalData: Record<string, unknown> = {}) => {
        // Only import analyticsManager when needed
        import('@/utils/analyticsManager').then(({ analyticsManager }) => {
          analyticsManager.trackNavigationEvent(eventType, {
            ...baseData,
            ...additionalData,
            timestamp: Date.now()
          });
        });
      }
    }), [eventType, baseData]);
    return tracker;
  }, []);

  return {
    createDebouncedCallback,
    createThrottledCallback,
    createAnalyticsTracker
  };
};

/**
 * Hook for intersection observer-based lazy loading
 */
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const observe = useCallback((element: Element, callback: (entry: IntersectionObserverEntry) => void) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          callback(entry);
        });
      }, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      });
    }
    
    observerRef.current.observe(element);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.unobserve(element);
      }
    };
  }, [options]);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  return { observe, disconnect };
};