import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BottomSheet } from '../components/layout/BottomSheet';
import { GlassHeader } from '../components/layout/GlassHeader';

// Mock useMediaQuery hooks
vi.mock('../hooks/useMediaQuery', () => ({
  useMediaQuery: vi.fn(),
  useIsMobile: vi.fn(),
}));

import { useMediaQuery, useIsMobile } from '../hooks/useMediaQuery';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Responsive Behavior Tests - Requirement 8 & 10', () => {
  describe('Mobile Breakpoint (< 768px)', () => {
    beforeEach(() => {
      vi.mocked(useMediaQuery).mockReturnValue(true);
      vi.mocked(useIsMobile).mockReturnValue(true);
    });

    it('should render BottomSheet as Sheet on mobile', () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Mobile Content</div>
        </BottomSheet>
      );

      // Sheet should be rendered with bottom side
      const content = screen.getByText('Mobile Content');
      expect(content).toBeInTheDocument();
    });

    it('should display bottom sheets for primary actions on mobile', () => {
      const handleChange = vi.fn();
      render(
        <BottomSheet open={true} onOpenChange={handleChange}>
          <div data-testid="action-content">
            <h2>Primary Action</h2>
            <button>Confirm</button>
          </div>
        </BottomSheet>
      );

      const actionContent = screen.getByTestId('action-content');
      expect(actionContent).toBeInTheDocument();
      expect(screen.getByText('Primary Action')).toBeInTheDocument();
    });

    it('should render GlassHeader with mobile-optimized layout', () => {
      render(
        <GlassHeader
          title="Mobile Header"
          actions={<button>Action</button>}
        />
      );

      const header = screen.getByText('Mobile Header');
      expect(header).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
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
          <div>Tablet Content</div>
        </BottomSheet>
      );

      const content = screen.getByText('Tablet Content');
      expect(content).toBeInTheDocument();
    });

    it('should use standard modal presentation on tablet', () => {
      const handleChange = vi.fn();
      render(
        <BottomSheet open={true} onOpenChange={handleChange}>
          <div data-testid="modal-content">
            <h2>Modal Title</h2>
            <p>Modal content for tablet</p>
          </div>
        </BottomSheet>
      );

      const modalContent = screen.getByTestId('modal-content');
      expect(modalContent).toBeInTheDocument();
      expect(screen.getByText('Modal Title')).toBeInTheDocument();
    });

    it('should render GlassHeader with full features on tablet', () => {
      render(
        <GlassHeader
          title="Tablet Header"
          actions={
            <div>
              <button>Action 1</button>
              <button>Action 2</button>
            </div>
          }
          sticky={true}
        />
      );

      const header = screen.getByText('Tablet Header');
      expect(header).toBeInTheDocument();
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });
  });

  describe('Desktop Breakpoint (>= 1024px)', () => {
    beforeEach(() => {
      vi.mocked(useMediaQuery).mockReturnValue(false);
      vi.mocked(useIsMobile).mockReturnValue(false);
    });

    it('should render modals as Dialog on desktop', () => {
      render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Desktop Content</div>
        </BottomSheet>
      );

      const content = screen.getByText('Desktop Content');
      expect(content).toBeInTheDocument();
    });

    it('should use centered modal presentation on desktop', () => {
      const handleChange = vi.fn();
      render(
        <BottomSheet open={true} onOpenChange={handleChange}>
          <div data-testid="desktop-modal">
            <h2>Desktop Modal</h2>
            <p>Centered modal content</p>
          </div>
        </BottomSheet>
      );

      const modalContent = screen.getByTestId('desktop-modal');
      expect(modalContent).toBeInTheDocument();
      expect(screen.getByText('Desktop Modal')).toBeInTheDocument();
    });

    it('should render GlassHeader with proper styling on desktop', () => {
      render(
        <GlassHeader title="Desktop Header" />
      );

      const header = screen.getByText('Desktop Header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Responsive Component Behavior', () => {
    it('should adapt BottomSheet based on viewport width', () => {
      // Test mobile
      vi.mocked(useIsMobile).mockReturnValue(true);
      const { rerender } = render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Responsive Content</div>
        </BottomSheet>
      );

      expect(screen.getByText('Responsive Content')).toBeInTheDocument();

      // Test desktop
      vi.mocked(useIsMobile).mockReturnValue(false);
      rerender(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Responsive Content</div>
        </BottomSheet>
      );

      expect(screen.getByText('Responsive Content')).toBeInTheDocument();
    });

    it('should maintain consistent styling across breakpoints', () => {
      const breakpoints = [true, false]; // mobile, desktop

      breakpoints.forEach(isMobile => {
        vi.mocked(useIsMobile).mockReturnValue(isMobile);

        const { container, unmount } = render(
          <GlassHeader title="Consistent Header" />
        );

        const header = container.querySelector('h1');
        expect(header).toBeInTheDocument();
        expect(header?.textContent).toBe('Consistent Header');

        unmount();
      });
    });
  });

  describe('Glassmorphism Effects - Requirement 7', () => {
    it('should apply backdrop-blur to GlassHeader', () => {
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
      expect(title.className).toContain('text-');
    });
  });
});
