/**
 * GlassHeader Validation Tests
 * 
 * Validates the GlassHeader component against the design specification
 * and acceptance criteria from Requirement 7: Glassmorphism Visual Effects
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GlassHeader, GlassHeaderCompact } from '../GlassHeader';

describe('GlassHeader - Requirement 7: Glassmorphism Visual Effects', () => {
  describe('7.1: Backdrop-blur effects for headers', () => {
    it('should apply backdrop-blur effect to create glassmorphism', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      
      // Verify backdrop-blur is applied
      expect(header).toHaveClass('backdrop-blur-md');
    });

    it('should apply backdrop-blur to compact variant', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('backdrop-blur-md');
    });
  });

  describe('7.2: Backdrop-blur with subtle transparency', () => {
    it('should apply semi-transparent background', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      
      // Verify background has transparency (80% opacity)
      expect(header).toHaveClass('bg-background/80');
    });

    it('should have subtle border for depth', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      
      // Verify border with reduced opacity
      expect(header).toHaveClass('border-b');
      expect(header).toHaveClass('border-border/50');
    });
  });

  describe('7.3: Text readability with sufficient contrast', () => {
    it('should ensure title text has high contrast', () => {
      const { container } = render(<GlassHeader title="Test Title" />);
      const title = container.querySelector('h1');
      
      // Verify foreground color is used for maximum contrast
      expect(title).toHaveClass('text-foreground');
    });

    it('should ensure subtitle has readable contrast', () => {
      const { container } = render(
        <GlassHeader title="Test" subtitle="Subtitle" />
      );
      const subtitle = container.querySelector('.text-muted-foreground');
      
      // Verify muted foreground still maintains readability
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveClass('text-muted-foreground');
    });

    it('should use semibold font weight for better readability', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const title = container.querySelector('h1');
      
      expect(title).toHaveClass('font-semibold');
    });
  });

  describe('7.4: Smooth performance with backdrop-blur', () => {
    it('should have smooth transitions for scroll effects', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      
      // Verify transition properties for smooth performance
      expect(header).toHaveClass('transition-all');
      expect(header).toHaveClass('duration-200');
    });

    it('should use GPU-accelerated properties', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      
      // backdrop-blur is GPU-accelerated
      expect(header).toHaveClass('backdrop-blur-md');
    });
  });

  describe('Task 2.3: Sticky positioning with proper z-index', () => {
    it('should be sticky by default', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('sticky');
      expect(header).toHaveClass('top-0');
    });

    it('should have proper z-index for layering', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      
      // z-50 ensures header stays above most content
      expect(header).toHaveClass('z-50');
    });

    it('should allow disabling sticky behavior', () => {
      const { container } = render(<GlassHeader title="Test" sticky={false} />);
      const header = container.querySelector('header');
      
      expect(header).not.toHaveClass('sticky');
      expect(header).not.toHaveClass('z-50');
    });
  });

  describe('Task 2.3: Optional action buttons support', () => {
    it('should support rendering action buttons', () => {
      const { container } = render(
        <GlassHeader
          title="Test"
          actions={<button data-testid="action-btn">Action</button>}
        />
      );
      
      const actionButton = container.querySelector('[data-testid="action-btn"]');
      expect(actionButton).toBeInTheDocument();
    });

    it('should properly space multiple actions', () => {
      const { container } = render(
        <GlassHeader
          title="Test"
          actions={
            <>
              <button>Action 1</button>
              <button>Action 2</button>
            </>
          }
        />
      );
      
      const actionsContainer = container.querySelector('.flex.items-center.gap-2');
      expect(actionsContainer).toBeInTheDocument();
      expect(actionsContainer).toHaveClass('gap-2');
    });

    it('should not render actions container when no actions provided', () => {
      const { container } = render(<GlassHeader title="Test" />);
      
      const actionsContainer = container.querySelector('.flex.items-center.gap-2');
      expect(actionsContainer).not.toBeInTheDocument();
    });
  });

  describe('Design System Compliance', () => {
    it('should use container for responsive width', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const contentContainer = container.querySelector('.container');
      
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass('mx-auto');
    });

    it('should have responsive padding', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const contentContainer = container.querySelector('.container');
      
      // Mobile-first responsive padding
      expect(contentContainer).toHaveClass('px-4');
      expect(contentContainer).toHaveClass('sm:px-6');
      expect(contentContainer).toHaveClass('lg:px-8');
    });

    it('should have consistent height', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const flexContainer = container.querySelector('.flex.h-16');
      
      // Standard header height: 4rem (64px)
      expect(flexContainer).toHaveClass('h-16');
    });

    it('should use flexbox for layout', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const flexContainer = container.querySelector('.flex');
      
      expect(flexContainer).toHaveClass('items-center');
      expect(flexContainer).toHaveClass('justify-between');
    });
  });

  describe('Responsive Typography', () => {
    it('should have responsive title sizing', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const title = container.querySelector('h1');
      
      // Mobile: text-xl (1.25rem), Desktop: text-2xl (1.5rem)
      expect(title).toHaveClass('text-xl');
      expect(title).toHaveClass('sm:text-2xl');
    });

    it('should have smaller text in compact variant', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const title = container.querySelector('h1');
      
      // Compact uses text-lg (1.125rem)
      expect(title).toHaveClass('text-lg');
    });

    it('should have appropriate subtitle sizing', () => {
      const { container } = render(
        <GlassHeader title="Test" subtitle="Subtitle" />
      );
      const subtitle = container.querySelector('.text-sm');
      
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveClass('text-sm');
    });
  });

  describe('Accessibility Compliance', () => {
    it('should use semantic HTML header element', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      
      expect(header).toBeInTheDocument();
      expect(header?.tagName).toBe('HEADER');
    });

    it('should use h1 for main title', () => {
      const { container } = render(<GlassHeader title="Test Title" />);
      const h1 = container.querySelector('h1');
      
      expect(h1).toBeInTheDocument();
      expect(h1?.tagName).toBe('H1');
      expect(h1).toHaveTextContent('Test Title');
    });

    it('should maintain proper heading hierarchy', () => {
      const { container } = render(
        <GlassHeader title="Main Title" subtitle="Subtitle" />
      );
      
      const h1 = container.querySelector('h1');
      const subtitle = container.querySelector('p');
      
      expect(h1).toBeInTheDocument();
      expect(subtitle).toBeInTheDocument();
      // Subtitle uses p tag, not a heading, maintaining hierarchy
      expect(subtitle?.tagName).toBe('P');
    });
  });

  describe('Compact Variant Validation', () => {
    it('should have reduced height for space-constrained layouts', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const flexContainer = container.querySelector('.flex');
      
      // Compact height: 3rem (48px) vs standard 4rem (64px)
      expect(flexContainer).toHaveClass('h-12');
    });

    it('should have reduced padding for compact layout', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const contentContainer = container.querySelector('.container');
      
      // Compact uses uniform px-4 padding
      expect(contentContainer).toHaveClass('px-4');
    });

    it('should maintain all glassmorphism effects', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('backdrop-blur-md');
      expect(header).toHaveClass('bg-background/80');
      expect(header).toHaveClass('border-b');
      expect(header).toHaveClass('border-border/50');
    });

    it('should support sticky positioning', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('sticky');
      expect(header).toHaveClass('top-0');
      expect(header).toHaveClass('z-50');
    });
  });

  describe('Integration with Design System', () => {
    it('should use design system color tokens', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      const title = container.querySelector('h1');
      
      // Uses CSS variables from design system
      expect(header).toHaveClass('bg-background/80');
      expect(header).toHaveClass('border-border/50');
      expect(title).toHaveClass('text-foreground');
    });

    it('should support custom className for extensibility', () => {
      const { container } = render(
        <GlassHeader title="Test" className="custom-header-class" />
      );
      const header = container.querySelector('header');
      
      // Custom class should be merged with default classes
      expect(header).toHaveClass('custom-header-class');
      expect(header).toHaveClass('backdrop-blur-md');
    });

    it('should maintain consistent spacing with design system', () => {
      const { container } = render(
        <GlassHeader
          title="Test"
          actions={<button>Action</button>}
        />
      );
      const actionsContainer = container.querySelector('.flex.items-center.gap-2');
      
      // gap-2 = 0.5rem spacing between actions
      expect(actionsContainer).toHaveClass('gap-2');
    });
  });
});
