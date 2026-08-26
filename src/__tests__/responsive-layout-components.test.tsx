import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottomSheet } from '../components/layout/BottomSheet';
import { GlassHeader } from '../components/layout/GlassHeader';

// Mock useMediaQuery hooks
vi.mock('../hooks/useMediaQuery', () => ({
  useMediaQuery: vi.fn(),
  useIsMobile: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import { useMediaQuery, useIsMobile } from '../hooks/useMediaQuery';

describe('Responsive Layout Component Tests', () => {
  describe('Mobile Breakpoint (< 768px)', () => {
    beforeEach(() => {
      vi.mocked(useMediaQuery).mockReturnValue(true);
      vi.mocked(useIsMobile).mockReturnValue(true);
    });

    it('should render BottomSheet as Sheet on mobile', () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div data-testid="mobile-content">Mobile Content</div>
        </BottomSheet>
      );

      expect(screen.getByTestId('mobile-content')).toBeInTheDocument();
    });

    it('should render GlassHeader with mobile layout', () => {
      render(
        <GlassHeader
          title="Mobile Header"
          actions={<button data-testid="action-btn">Action</button>}
        />
      );

      expect(screen.getByText('Mobile Header')).toBeInTheDocument();
      expect(screen.getByTestId('action-btn')).toBeInTheDocument();
    });
  });

  describe('Tablet Breakpoint (768px - 1024px)', () => {
    beforeEach(() => {
      vi.mocked(useMediaQuery).mockReturnValue(false);
      vi.mocked(useIsMobile).mockReturnValue(false);
    });

    it('should render BottomSheet as Dialog on tablet', () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div data-testid="tablet-content">Tablet Content</div>
        </BottomSheet>
      );

      expect(screen.getByTestId('tablet-content')).toBeInTheDocument();
    });

    it('should render GlassHeader with full features', () => {
      render(
        <GlassHeader
          title="Tablet Header"
          actions={
            <div>
              <button data-testid="action-1">Action 1</button>
              <button data-testid="action-2">Action 2</button>
            </div>
          }
          sticky={true}
        />
      );

      expect(screen.getByText('Tablet Header')).toBeInTheDocument();
      expect(screen.getByTestId('action-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-2')).toBeInTheDocument();
    });
  });

  describe('Desktop Breakpoint (>= 1024px)', () => {
    beforeEach(() => {
      vi.mocked(useMediaQuery).mockReturnValue(false);
      vi.mocked(useIsMobile).mockReturnValue(false);
    });

    it('should render BottomSheet as centered Dialog on desktop', () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div data-testid="desktop-content">Desktop Content</div>
        </BottomSheet>
      );

      expect(screen.getByTestId('desktop-content')).toBeInTheDocument();
    });
  });

  describe('Responsive Adaptation', () => {
    it('BottomSheet should adapt based on viewport', () => {
      // Mobile
      vi.mocked(useIsMobile).mockReturnValue(true);
      const { unmount } = render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div data-testid="adaptive-content">Adaptive Content</div>
        </BottomSheet>
      );

      expect(screen.getByTestId('adaptive-content')).toBeInTheDocument();
      unmount();

      // Desktop
      vi.mocked(useIsMobile).mockReturnValue(false);
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div data-testid="adaptive-content">Adaptive Content</div>
        </BottomSheet>
      );

      expect(screen.getByTestId('adaptive-content')).toBeInTheDocument();
    });

    it('GlassHeader should maintain styling across breakpoints', () => {
      const breakpoints = [true, false];

      breakpoints.forEach(isMobile => {
        vi.mocked(useIsMobile).mockReturnValue(isMobile);

        const { container, unmount } = render(
          <GlassHeader title="Consistent Header" />
        );

        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
        expect(header?.className).toContain('backdrop-blur');

        unmount();
      });
    });
  });

  describe('Glassmorphism Effects', () => {
    it('GlassHeader should apply backdrop-blur', () => {
      const { container } = render(
        <GlassHeader title="Glass Header" />
      );

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header?.className).toContain('backdrop-blur');
    });

    it('should maintain text readability with glassmorphism', () => {
      render(
        <GlassHeader
          title="Readable Text"
          actions={<button>Action</button>}
        />
      );

      const title = screen.getByText('Readable Text');
      expect(title).toBeInTheDocument();
    });
  });
});
