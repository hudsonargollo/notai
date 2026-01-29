/**
 * Performance Optimization Utilities
 * 
 * This module provides utilities for optimizing React component performance,
 * including memoization helpers, debouncing, and render optimization.
 */

import { useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Debounce hook
 * Delays the execution of a function until after a specified delay
 * Useful for expensive operations like search or API calls
 * 
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 300);
 * 
 * useEffect(() => {
 *   // This will only run 300ms after the user stops typing
 *   performSearch(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook
 * Limits the rate at which a function can be called
 * Useful for scroll handlers or resize events
 * 
 * @example
 * const throttledScroll = useThrottle(handleScroll, 100);
 * 
 * useEffect(() => {
 *   window.addEventListener('scroll', throttledScroll);
 *   return () => window.removeEventListener('scroll', throttledScroll);
 * }, [throttledScroll]);
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        return callback(...args);
      }
    },
    [callback, delay]
  ) as T;
}

/**
 * Intersection Observer hook
 * Lazy loads components when they enter the viewport
 * Improves initial render performance
 * 
 * @example
 * const [ref, isVisible] = useIntersectionObserver();
 * 
 * return (
 *   <div ref={ref}>
 *     {isVisible && <HeavyComponent />}
 *   </div>
 * );
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const [node, setNode] = useState<Element | null>(null);

  const observer = useMemo(
    () =>
      typeof window !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
          }, options)
        : null,
    [options]
  );

  useEffect(() => {
    if (!node || !observer) return;

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node, observer]);

  return [setNode, isVisible];
}

/**
 * Memoized callback that only changes when dependencies change
 * Wrapper around useCallback with better TypeScript support
 * 
 * @example
 * const handleClick = useMemoizedCallback(() => {
 *   console.log('Clicked!');
 * }, []);
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

/**
 * Memoized value that only recomputes when dependencies change
 * Wrapper around useMemo with better TypeScript support
 * 
 * @example
 * const expensiveValue = useMemoizedValue(() => {
 *   return computeExpensiveValue(data);
 * }, [data]);
 */
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

/**
 * Request Animation Frame hook
 * Optimizes animations by syncing with browser repaint
 * 
 * @example
 * const [position, setPosition] = useState(0);
 * 
 * useAnimationFrame(() => {
 *   setPosition(prev => prev + 1);
 * });
 */
export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
}

/**
 * Idle callback hook
 * Defers non-critical work until browser is idle
 * Improves perceived performance
 * 
 * @example
 * useIdleCallback(() => {
 *   // Perform non-critical work
 *   preloadImages();
 * });
 */
export function useIdleCallback(callback: () => void, deps: React.DependencyList = []) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(callback);
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      const id = setTimeout(callback, 1);
      return () => clearTimeout(id);
    }
  }, deps);
}

/**
 * Preload image utility
 * Preloads images to prevent layout shifts
 * 
 * @example
 * useEffect(() => {
 *   preloadImage('/path/to/image.jpg');
 * }, []);
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Batch state updates
 * Groups multiple state updates into a single render
 * 
 * @example
 * const batchUpdate = useBatchUpdate();
 * 
 * batchUpdate(() => {
 *   setState1(value1);
 *   setState2(value2);
 *   setState3(value3);
 * });
 */
export function useBatchUpdate() {
  return useCallback((callback: () => void) => {
    // React 18+ automatically batches updates
    // This is a no-op but kept for API consistency
    callback();
  }, []);
}

/**
 * Performance monitoring hook
 * Logs component render times in development
 * 
 * @example
 * usePerformanceMonitor('MyComponent');
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Performance] ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`
      );
    }

    startTime.current = performance.now();
  });
}

// Missing import
import { useState } from 'react';
