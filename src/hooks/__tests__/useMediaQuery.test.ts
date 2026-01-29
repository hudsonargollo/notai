/**
 * Unit Tests for Responsive Utilities
 * 
 * Tests for useMediaQuery hook and related utilities.
 * These tests verify the core functionality of responsive utilities.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useResponsiveConfig,
  useBreakpointValue,
  getResponsiveConfig,
  getBreakpointValue,
  BREAKPOINTS,
  MEDIA_QUERIES,
} from '../useMediaQuery';

// Mock matchMedia
const createMatchMediaMock = (matches: boolean) => {
  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
};

describe('Responsive Utilities', () => {
  describe('BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(BREAKPOINTS.sm).toBe(640);
      expect(BREAKPOINTS.md).toBe(768);
      expect(BREAKPOINTS.lg).toBe(1024);
      expect(BREAKPOINTS.xl).toBe(1280);
      expect(BREAKPOINTS['2xl']).toBe(1536);
    });
  });

  describe('MEDIA_QUERIES', () => {
    it('should have valid media query strings', () => {
      expect(MEDIA_QUERIES.mobile).toContain('max-width');
      expect(MEDIA_QUERIES.tablet).toContain('min-width');
      expect(MEDIA_QUERIES.desktop).toContain('min-width');
      expect(MEDIA_QUERIES.sm).toContain('min-width');
      expect(MEDIA_QUERIES.md).toContain('min-width');
      expect(MEDIA_QUERIES.lg).toContain('min-width');
      expect(MEDIA_QUERIES.xl).toContain('min-width');
    });

    it('should format media queries correctly', () => {
      expect(MEDIA_QUERIES.mobile).toBe('(max-width: 767px)');
      expect(MEDIA_QUERIES.md).toBe('(min-width: 768px)');
      expect(MEDIA_QUERIES.lg).toBe('(min-width: 1024px)');
    });
  });

  describe('getResponsiveConfig', () => {
    it('should return mobile config for width < 768px', () => {
      const config = getResponsiveConfig(500);
      
      expect(config.breakpoint).toBe(500);
      expect(config.useMobileLayout).toBe(true);
      expect(config.useBottomSheet).toBe(true);
      expect(config.touchTargetSize).toBe(44);
      expect(config.enableGestures).toBe(true);
    });

    it('should return desktop config for width >= 768px', () => {
      const config = getResponsiveConfig(1024);
      
      expect(config.breakpoint).toBe(1024);
      expect(config.useMobileLayout).toBe(false);
      expect(config.useBottomSheet).toBe(false);
      expect(config.touchTargetSize).toBe(32);
      expect(config.enableGestures).toBe(false);
    });

    it('should handle edge case at exactly 768px', () => {
      const config = getResponsiveConfig(768);
      
      expect(config.useMobileLayout).toBe(false);
      expect(config.useBottomSheet).toBe(false);
    });
  });

  describe('getBreakpointValue', () => {
    const values = {
      default: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
      '2xl': 6,
    };

    it('should return default value for width < 640px', () => {
      expect(getBreakpointValue(500, values)).toBe(1);
    });

    it('should return sm value for width >= 640px', () => {
      expect(getBreakpointValue(640, values)).toBe(2);
      expect(getBreakpointValue(700, values)).toBe(2);
    });

    it('should return md value for width >= 768px', () => {
      expect(getBreakpointValue(768, values)).toBe(3);
      expect(getBreakpointValue(800, values)).toBe(3);
    });

    it('should return lg value for width >= 1024px', () => {
      expect(getBreakpointValue(1024, values)).toBe(4);
      expect(getBreakpointValue(1100, values)).toBe(4);
    });

    it('should return xl value for width >= 1280px', () => {
      expect(getBreakpointValue(1280, values)).toBe(5);
      expect(getBreakpointValue(1400, values)).toBe(5);
    });

    it('should return 2xl value for width >= 1536px', () => {
      expect(getBreakpointValue(1536, values)).toBe(6);
      expect(getBreakpointValue(1600, values)).toBe(6);
    });

    it('should handle missing breakpoint values', () => {
      const partialValues = {
        default: 1,
        lg: 4,
      };
      
      expect(getBreakpointValue(500, partialValues)).toBe(1);
      expect(getBreakpointValue(700, partialValues)).toBe(1);
      expect(getBreakpointValue(1024, partialValues)).toBe(4);
    });
  });

  describe('useMediaQuery', () => {
    let matchMediaMock: any;

    beforeEach(() => {
      matchMediaMock = createMatchMediaMock(false);
      window.matchMedia = matchMediaMock as any;
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should return false initially', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      
      expect(result.current).toBe(false);
    });

    it('should return true when media query matches', () => {
      matchMediaMock = createMatchMediaMock(true);
      window.matchMedia = matchMediaMock as any;
      
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      
      expect(result.current).toBe(true);
    });

    it('should add event listener on mount', () => {
      const addEventListener = vi.fn();
      matchMediaMock = (query: string) => ({
        matches: false,
        media: query,
        addEventListener,
        removeEventListener: vi.fn(),
      });
      window.matchMedia = matchMediaMock as any;
      
      renderHook(() => useMediaQuery('(min-width: 768px)'));
      
      expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should remove event listener on unmount', () => {
      const removeEventListener = vi.fn();
      matchMediaMock = (query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener,
      });
      window.matchMedia = matchMediaMock as any;
      
      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      unmount();
      
      expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should update when media query changes', () => {
      let listener: any;
      const addEventListener = vi.fn((event, fn) => {
        listener = fn;
      });
      
      matchMediaMock = (query: string) => ({
        matches: false,
        media: query,
        addEventListener,
        removeEventListener: vi.fn(),
      });
      window.matchMedia = matchMediaMock as any;
      
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      
      expect(result.current).toBe(false);
      
      // Simulate media query change
      act(() => {
        listener({ matches: true });
      });
      
      expect(result.current).toBe(true);
    });
  });

  describe('useIsMobile', () => {
    it('should return true for mobile viewport', () => {
      const matchMediaMock = createMatchMediaMock(true);
      window.matchMedia = matchMediaMock as any;
      
      const { result } = renderHook(() => useIsMobile());
      
      expect(result.current).toBe(true);
    });

    it('should return false for non-mobile viewport', () => {
      const matchMediaMock = createMatchMediaMock(false);
      window.matchMedia = matchMediaMock as any;
      
      const { result } = renderHook(() => useIsMobile());
      
      expect(result.current).toBe(false);
    });
  });

  describe('useIsTablet', () => {
    it('should use correct media query', () => {
      const matchMediaMock = vi.fn(createMatchMediaMock(false));
      window.matchMedia = matchMediaMock as any;
      
      renderHook(() => useIsTablet());
      
      expect(matchMediaMock).toHaveBeenCalledWith(MEDIA_QUERIES.tablet);
    });
  });

  describe('useIsDesktop', () => {
    it('should use correct media query', () => {
      const matchMediaMock = vi.fn(createMatchMediaMock(false));
      window.matchMedia = matchMediaMock as any;
      
      renderHook(() => useIsDesktop());
      
      expect(matchMediaMock).toHaveBeenCalledWith(MEDIA_QUERIES.desktop);
    });
  });

  describe('useResponsiveConfig', () => {
    beforeEach(() => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should return config based on window width', () => {
      const { result } = renderHook(() => useResponsiveConfig());
      
      expect(result.current.breakpoint).toBe(1024);
      expect(result.current.useMobileLayout).toBe(false);
    });

    it('should update on window resize', () => {
      const { result } = renderHook(() => useResponsiveConfig());
      
      // Change window width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      
      // Trigger resize event
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      
      expect(result.current.breakpoint).toBe(500);
      expect(result.current.useMobileLayout).toBe(true);
    });
  });

  describe('useBreakpointValue', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should return value based on current breakpoint', () => {
      const values = {
        default: 1,
        md: 2,
        lg: 3,
      };
      
      const { result } = renderHook(() => useBreakpointValue(values));
      
      expect(result.current).toBe(3); // lg value for 1024px
    });

    it('should update when window resizes', () => {
      const values = {
        default: 1,
        md: 2,
        lg: 3,
      };
      
      const { result } = renderHook(() => useBreakpointValue(values));
      
      expect(result.current).toBe(3);
      
      // Change to mobile width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      
      expect(result.current).toBe(1); // default value for 500px
    });
  });

  describe('Edge Cases', () => {
    it('should handle SSR environment (no window)', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const config = getResponsiveConfig(1024);
      expect(config).toBeDefined();
      
      global.window = originalWindow;
    });

    it('should handle very small viewport widths', () => {
      const config = getResponsiveConfig(320);
      expect(config.useMobileLayout).toBe(true);
    });

    it('should handle very large viewport widths', () => {
      const config = getResponsiveConfig(3000);
      expect(config.useMobileLayout).toBe(false);
    });

    it('should handle breakpoint boundary values', () => {
      expect(getResponsiveConfig(767).useMobileLayout).toBe(true);
      expect(getResponsiveConfig(768).useMobileLayout).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should accept string values in getBreakpointValue', () => {
      const values = {
        default: 'small',
        md: 'medium',
        lg: 'large',
      };
      
      const result = getBreakpointValue(1024, values);
      expect(result).toBe('large');
    });

    it('should accept object values in getBreakpointValue', () => {
      const values = {
        default: { size: 1 },
        md: { size: 2 },
        lg: { size: 3 },
      };
      
      const result = getBreakpointValue(1024, values);
      expect(result).toEqual({ size: 3 });
    });
  });
});
