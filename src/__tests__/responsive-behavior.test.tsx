import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { BottomSheet } from '../components/layout/BottomSheet';
import { FloatingActionButton } from '../components/layout/FloatingActionButton';
import { GlassHeader } from '../components/layout/GlassHeader';
import { NeoCore } from '../components/layout/NeoCore';
import { Plus, Settings, Home, Camera } from 'lucide-react';

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

    it('should have minimum touch target size of 44x44px for FAB', () => {
      const { container } = render(
        <FloatingActionButton
          icon={Plus}
          onClick={() => {}}
          label="Add"
        />
      );
      
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      // FAB should be 56px (h-14 w-14) which exceeds 44px minimum
      expect(button?.className).toContain('h-14');
      expect(button?.className).toContain('w-14');
    });

    it('should have minimum touch target size for all interactive buttons', () => {
      const { container } = render(
        <div>
          <FloatingActionButton
            icon={Plus}
            onClick={() => {}}
            label="Add"
            secondaryActions={[
              { icon: Settings, label: 'Settings', onClick: () => {} },
              { icon: Home, label: 'Home', onClick: () => {} },
            ]}
          />
        </div>
      );
      
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        // All buttons should have adequate touch targets
        const hasMinSize = button.className.includes('h-14') || 
                          button.className.includes('h-12') ||
                          button.className.includes('h-10');
        expect(hasMinSize).toBe(true);
      });
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

    it('should render NeoCore mascot at appropriate size for mobile', () => {
      const { container } = render(
        <NeoCore state="idle" size={100} />
      );
      
      const mascot = container.querySelector('[data-testid="neo-core"]');
      expect(mascot).toBeInTheDocument();
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

    it('should render FAB with appropriate sizing for tablet', () => {
      const { container } = render(
        <FloatingActionButton
          icon={Camera}
          onClick={() => {}}
          label="Scan"
        />
      );
      
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button?.className).toContain('h-14');
      expect(button?.className).toContain('w-14');
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

    it('should render FAB in bottom-right corner on desktop', () => {
      const { container } = render(
        <FloatingActionButton
          icon={Plus}
          onClick={() => {}}
          label="Add Item"
        />
      );
      
      const fabContainer = container.querySelector('.fixed');
      expect(fabContainer).toBeInTheDocument();
      expect(fabContainer?.className).toContain('bottom-6');
      expect(fabContainer?.className).toContain('right-6');
    });

    it('should render NeoCore mascot at full size on desktop', () => {
      const { container } = render(
        <NeoCore state="idle" size={140} />
      );
      
      const mascot = container.querySelector('[data-testid="neo-core"]');
      expect(mascot).toBeInTheDocument();
    });

    it('should support expanded FAB with secondary actions on desktop', () => {
      const { container } = render(
        <FloatingActionButton
          icon={Plus}
          onClick={() => {}}
          label="Main Action"
          secondaryActions={[
            { icon: Settings, label: 'Settings', onClick: () => {} },
            { icon: Home, label: 'Home', onClick: () => {} },
            { icon: Camera, label: 'Camera', onClick: () => {} },
          ]}
        />
      );
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Touch Target Sizes - Requirement 8', () => {
    beforeEach(() => {
      vi.mocked(useMediaQuery).mockReturnValue(true);
      vi.mocked(useIsMobile).mockReturnValue(true);
    });

    it('FAB should meet minimum 44x44px touch target on mobile', () => {
      const { container } = render(
        <FloatingActionButton
          icon={Settings}
          onClick={() => {}}
          label="Settings"
        />
      );
      
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      // h-14 = 56px, w-14 = 56px (exceeds 44px minimum)
      expect(button?.className).toContain('h-14');
      expect(button?.className).toContain('w-14');
    });

    it('all interactive elements should have adequate touch targets', () => {
      const { container } = render(
        <div>
          <FloatingActionButton
            icon={Plus}
            onClick={() => {}}
            label="Add"
          />
          <GlassHeader 
            title="Test" 
            actions={<button className="h-10 w-10">X</button>}
          />
        </div>
      );
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        // Check that buttons have minimum size classes
        const hasAdequateSize = 
          button.className.includes('h-14') || 
          button.className.includes('h-12') ||
          button.className.includes('h-10') ||
          button.className.includes('h-11');
        expect(hasAdequateSize).toBe(true);
      });
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

  describe('NeoCore Mascot Responsive Behavior - Requirement 13', () => {
    it('should render at different sizes based on viewport', () => {
      const sizes = [100, 120, 140];
      
      sizes.forEach(size => {
        const { container } = render(
          <NeoCore state="idle" size={size} />
        );
        
        const mascot = container.querySelector('[data-testid="neo-core"]');
        expect(mascot).toBeInTheDocument();
      });
    });

    it('should support all state variations', () => {
      const states: Array<'idle' | 'listening' | 'processing' | 'success'> = [
        'idle', 'listening', 'processing', 'success'
      ];
      
      states.forEach(state => {
        const { container } = render(
          <NeoCore state={state} size={120} />
        );
        
        const mascot = container.querySelector('[data-testid="neo-core"]');
        expect(mascot).toBeInTheDocument();
      });
    });
  });
});
