/**
 * Responsive Utilities
 * 
 * Hooks and helper functions for responsive behavior across the application.
 * Provides consistent breakpoint handling and media query management.
 */

import { useState, useEffect } from "react";

/**
 * Breakpoint Constants
 * 
 * Standard Tailwind CSS breakpoints for consistent responsive behavior.
 * Use these constants to ensure consistency across the application.
 */
export const BREAKPOINTS = {
  sm: 640,   // Mobile landscape
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280,  // Large desktop
  "2xl": 1536, // Extra large desktop
} as const;

/**
 * Media Query Strings
 * 
 * Pre-defined media query strings for common breakpoints.
 * Use with useMediaQuery hook for responsive behavior.
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  "2xl": `(min-width: ${BREAKPOINTS["2xl"]}px)`,
} as const;

/**
 * useMediaQuery Hook
 * 
 * React hook for responsive behavior based on media queries.
 * Returns true if the media query matches, false otherwise.
 * 
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the media query matches
 * 
 * @example
 * // Using custom media query
 * const isLargeScreen = useMediaQuery("(min-width: 1024px)");
 * 
 * @example
 * // Using predefined media query
 * const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
 * 
 * @example
 * // Conditional rendering based on screen size
 * const isMobile = useMediaQuery(MEDIA_QUERIES.mobile);
 * return isMobile ? <MobileView /> : <DesktopView />;
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with false to avoid hydration mismatch in SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (using both old and new API for compatibility)
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener);
      } else {
        // Fallback for older browsers
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Responsive Configuration Interface
 * 
 * Configuration object for responsive behavior settings.
 */
export interface ResponsiveConfig {
  /** Current viewport width */
  breakpoint: number;
  /** Whether to use mobile layout patterns */
  useMobileLayout: boolean;
  /** Whether to use bottom sheet instead of modal */
  useBottomSheet: boolean;
  /** Minimum touch target size in pixels */
  touchTargetSize: number;
  /** Whether to enable gesture interactions */
  enableGestures: boolean;
}

/**
 * getResponsiveConfig
 * 
 * Returns responsive configuration based on viewport width.
 * Provides consistent behavior settings across the application.
 * 
 * @param width - Current viewport width in pixels
 * @returns ResponsiveConfig object with behavior settings
 * 
 * @example
 * const config = getResponsiveConfig(window.innerWidth);
 * if (config.useBottomSheet) {
 *   return <BottomSheet />;
 * }
 */
export function getResponsiveConfig(width: number): ResponsiveConfig {
  // Mobile configuration (< 768px)
  if (width < BREAKPOINTS.md) {
    return {
      breakpoint: width,
      useMobileLayout: true,
      useBottomSheet: true,
      touchTargetSize: 44, // iOS minimum touch target
      enableGestures: true,
    };
  }

  // Desktop configuration (>= 768px)
  return {
    breakpoint: width,
    useMobileLayout: false,
    useBottomSheet: false,
    touchTargetSize: 32, // Standard desktop target
    enableGestures: false,
  };
}

/**
 * useResponsiveConfig Hook
 * 
 * React hook that returns responsive configuration based on current viewport.
 * Automatically updates when viewport size changes.
 * 
 * @returns ResponsiveConfig object with current behavior settings
 * 
 * @example
 * const config = useResponsiveConfig();
 * return config.useBottomSheet ? <BottomSheet /> : <Dialog />;
 */
export function useResponsiveConfig(): ResponsiveConfig {
  const [config, setConfig] = useState<ResponsiveConfig>(() =>
    getResponsiveConfig(typeof window !== "undefined" ? window.innerWidth : 1024)
  );

  useEffect(() => {
    const handleResize = () => {
      setConfig(getResponsiveConfig(window.innerWidth));
    };

    // Set initial value
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return config;
}

/**
 * useIsMobile Hook
 * 
 * Convenience hook that returns true if viewport is mobile-sized.
 * Equivalent to useMediaQuery(MEDIA_QUERIES.mobile).
 * 
 * @returns boolean indicating if viewport is mobile-sized (< 768px)
 * 
 * @example
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileNav /> : <DesktopNav />;
 */
export function useIsMobile(): boolean {
  return useMediaQuery(MEDIA_QUERIES.mobile);
}

/**
 * useIsTablet Hook
 * 
 * Convenience hook that returns true if viewport is tablet-sized.
 * 
 * @returns boolean indicating if viewport is tablet-sized (768px - 1023px)
 * 
 * @example
 * const isTablet = useIsTablet();
 */
export function useIsTablet(): boolean {
  return useMediaQuery(MEDIA_QUERIES.tablet);
}

/**
 * useIsDesktop Hook
 * 
 * Convenience hook that returns true if viewport is desktop-sized.
 * 
 * @returns boolean indicating if viewport is desktop-sized (>= 1024px)
 * 
 * @example
 * const isDesktop = useIsDesktop();
 * return isDesktop ? <DesktopSidebar /> : null;
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(MEDIA_QUERIES.desktop);
}

/**
 * getBreakpointValue
 * 
 * Helper function to get responsive values based on current breakpoint.
 * Similar to Tailwind's responsive utilities but for JavaScript values.
 * 
 * @param width - Current viewport width
 * @param values - Object with breakpoint keys and corresponding values
 * @returns Value for the current breakpoint
 * 
 * @example
 * const columns = getBreakpointValue(window.innerWidth, {
 *   default: 1,
 *   sm: 2,
 *   md: 3,
 *   lg: 4,
 * });
 */
export function getBreakpointValue<T>(
  width: number,
  values: {
    default: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    "2xl"?: T;
  }
): T {
  if (width >= BREAKPOINTS["2xl"] && values["2xl"] !== undefined) {
    return values["2xl"];
  }
  if (width >= BREAKPOINTS.xl && values.xl !== undefined) {
    return values.xl;
  }
  if (width >= BREAKPOINTS.lg && values.lg !== undefined) {
    return values.lg;
  }
  if (width >= BREAKPOINTS.md && values.md !== undefined) {
    return values.md;
  }
  if (width >= BREAKPOINTS.sm && values.sm !== undefined) {
    return values.sm;
  }
  return values.default;
}

/**
 * useBreakpointValue Hook
 * 
 * React hook version of getBreakpointValue that automatically updates on resize.
 * 
 * @param values - Object with breakpoint keys and corresponding values
 * @returns Value for the current breakpoint
 * 
 * @example
 * const columns = useBreakpointValue({
 *   default: 1,
 *   sm: 2,
 *   md: 3,
 *   lg: 4,
 * });
 */
export function useBreakpointValue<T>(values: {
  default: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
}): T {
  const [value, setValue] = useState<T>(() =>
    getBreakpointValue(
      typeof window !== "undefined" ? window.innerWidth : 1024,
      values
    )
  );

  useEffect(() => {
    const handleResize = () => {
      setValue(getBreakpointValue(window.innerWidth, values));
    };

    // Set initial value
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [values]);

  return value;
}
