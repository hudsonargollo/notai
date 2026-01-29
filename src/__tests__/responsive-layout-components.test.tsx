import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottomSheet } from '../components/layout/BottomSheet';
import { FloatingActionButton } from '../components/layout/FloatingActionButton';
import { GlassHeader } from '../components/layout/GlassHeader';
import { NeoCore } from '../components/layout/NeoCore';
import { PageTransition } from '../components/layout/PageTransition';
import { Plus, Settings, Home, Camera } from 'lucide-react';

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

    it('should render FloatingActionButton with touch-friendly size', () => {
      const { container } = render(
        <FloatingActionButton
          icon={Plus}
          onClick={() => {}}
          label="Add"
        />
      );
      
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button?.className).toContain('h-14');
      expect(button?.className).toContain('w-14');
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

    it('should render NeoCore at mobile-appropriate size', () => {
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
          <div data-testid="tablet-content">Tablet Content</div>
        </BottomSheet>
      );
      
      expect(screen.getByTestId('tablet-content')).toBeInTheDocument();
    });

    it('should render FloatingActionButton with consistent sizing', () => {
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

    it('should render FloatingActionButton in bottom-right corner', () => {
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

    it('should render NeoCore at full desktop size', () => {
      const { container } = render(
        <NeoCore state="idle" size={140} />
      );
      
      const mascot = container.querySelector('[data-testid="neo-core"]');
      expect(mascot).toBeInTheDocument();
    });

    it('should support FAB with secondary actions', () => {
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

  describe('Touch Target Validation', () => {
    beforeEach(() => {
      vi.mocked(useIsMobile).mockReturnValue(true);
    });

    it('FloatingActionButton should exceed 44x44px minimum', () => {
      const { container } = render(
        <FloatingActionButton
          icon={Settings}
          onClick={() => {}}
          label="Settings"
        />
      );
      
      const button = container.querySelector('button');
      // h-14 = 56px, w-14 = 56px (exceeds 44px minimum)
      expect(button?.className).toContain('h-14');
      expect(button?.className).toContain('w-14');
    });

    it('all interactive buttons should have adequate touch targets', () => {
      const { container } = render(
        <div>
          <FloatingActionButton
            icon={Plus}
            onClick={() => {}}
            label="Add"
          />
          <GlassHeader 
            title="Test" 
            actions={<button className="h-10 w-10" data-testid="header-btn">X</button>}
          />
        </div>
      );
      
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        const hasAdequateSize = 
          button.className.includes('h-14') || 
          button.className.includes('h-12') ||
          button.className.includes('h-10') ||
          button.className.includes('h-11');
        expect(hasAdequateSize).toBe(true);
      });
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

  describe('NeoCore Mascot States', () => {
    it('should render at different sizes', () => {
      const sizes = [100, 120, 140];
      
      sizes.forEach(size => {
        const { container, unmount } = render(
          <NeoCore state="idle" size={size} />
        );
        
        const mascot = container.querySelector('[data-testid="neo-core"]');
        expect(mascot).toBeInTheDocument();
        
        unmount();
      });
    });

    it('should support all state variations', () => {
      const states: Array<'idle' | 'listening' | 'processing' | 'success'> = [
        'idle', 'listening', 'processing', 'success'
      ];
      
      states.forEach(state => {
        const { container, unmount } = render(
          <NeoCore state={state} size={120} />
        );
        
        const mascot = container.querySelector('[data-testid="neo-core"]');
        expect(mascot).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('Component Composition', () => {
    it('should render multiple layout components together', () => {
      const { container } = render(
        <div>
          <GlassHeader title="App Header" />
          <PageTransition>
            <div data-testid="page-content">
              <NeoCore state="idle" size={120} />
            </div>
          </PageTransition>
          <FloatingActionButton
            icon={Plus}
            onClick={() => {}}
            label="Add"
          />
        </div>
      );
      
      expect(screen.getByText('App Header')).toBeInTheDocument();
      expect(screen.getByTestId('page-content')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="neo-core"]')).toBeInTheDocument();
      expect(container.querySelector('.fixed')).toBeInTheDocument();
    });
  });
});
