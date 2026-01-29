/**
 * GlassHeader Component Tests
 * 
 * Tests for the GlassHeader component including:
 * - Basic rendering
 * - Props handling
 * - Styling and classes
 * - Accessibility
 * - Responsive behavior
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassHeader, GlassHeaderCompact } from '../GlassHeader';

describe('GlassHeader', () => {
  describe('Basic Rendering', () => {
    it('should render with title', () => {
      render(<GlassHeader title="Test Title" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render as a header element', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should render with subtitle when provided', () => {
      render(<GlassHeader title="Test Title" subtitle="Test Subtitle" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      const { container } = render(<GlassHeader title="Test Title" />);
      const subtitle = container.querySelector('.text-muted-foreground');
      expect(subtitle).not.toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should render action buttons when provided', () => {
      render(
        <GlassHeader
          title="Test"
          actions={<button>Action Button</button>}
        />
      );
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('should not render actions section when no actions provided', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const actionsContainer = container.querySelector('.flex.items-center.gap-2');
      expect(actionsContainer).not.toBeInTheDocument();
    });

    it('should render multiple action elements', () => {
      render(
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
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });
  });

  describe('Glassmorphism Styling', () => {
    it('should apply backdrop-blur effect', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('backdrop-blur-md');
    });

    it('should apply semi-transparent background', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-background/80');
    });

    it('should apply border with subtle contrast', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('border-b');
      expect(header).toHaveClass('border-border/50');
    });
  });

  describe('Sticky Positioning', () => {
    it('should be sticky by default', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky');
      expect(header).toHaveClass('top-0');
      expect(header).toHaveClass('z-50');
    });

    it('should not be sticky when sticky=false', () => {
      const { container } = render(<GlassHeader title="Test" sticky={false} />);
      const header = container.querySelector('header');
      expect(header).not.toHaveClass('sticky');
      expect(header).not.toHaveClass('top-0');
      expect(header).not.toHaveClass('z-50');
    });

    it('should have proper z-index when sticky', () => {
      const { container } = render(<GlassHeader title="Test" sticky={true} />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('z-50');
    });
  });

  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <GlassHeader title="Test" className="custom-class" />
      );
      const header = container.querySelector('header');
      expect(header).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <GlassHeader title="Test" className="custom-class" />
      );
      const header = container.querySelector('header');
      expect(header).toHaveClass('custom-class');
      expect(header).toHaveClass('backdrop-blur-md');
    });
  });

  describe('Text Contrast and Readability', () => {
    it('should use high contrast text color for title', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const title = container.querySelector('h1');
      expect(title).toHaveClass('text-foreground');
    });

    it('should use muted color for subtitle', () => {
      render(<GlassHeader title="Test" subtitle="Subtitle" />);
      const subtitle = screen.getByText('Subtitle');
      expect(subtitle).toHaveClass('text-muted-foreground');
    });

    it('should have proper font weight for title', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const title = container.querySelector('h1');
      expect(title).toHaveClass('font-semibold');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive text sizing', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const title = container.querySelector('h1');
      expect(title).toHaveClass('text-xl');
      expect(title).toHaveClass('sm:text-2xl');
    });

    it('should have responsive padding', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const contentContainer = container.querySelector('.container');
      expect(contentContainer).toHaveClass('px-4');
      expect(contentContainer).toHaveClass('sm:px-6');
      expect(contentContainer).toHaveClass('lg:px-8');
    });

    it('should have fixed height', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const flexContainer = container.querySelector('.flex.h-16');
      expect(flexContainer).toHaveClass('h-16');
    });
  });

  describe('Layout Structure', () => {
    it('should have proper container structure', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const containerDiv = container.querySelector('.container');
      expect(containerDiv).toBeInTheDocument();
      expect(containerDiv).toHaveClass('mx-auto');
    });

    it('should use flexbox for layout', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const flexContainer = container.querySelector('.flex.items-center.justify-between');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should align items vertically centered', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toHaveClass('items-center');
    });

    it('should space title and actions with justify-between', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toHaveClass('justify-between');
    });
  });

  describe('Transitions', () => {
    it('should have smooth transitions', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('transition-all');
      expect(header).toHaveClass('duration-200');
    });
  });

  describe('Accessibility', () => {
    it('should use semantic header element', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should use h1 for title', () => {
      const { container } = render(<GlassHeader title="Test" />);
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('Test');
    });

    it('should have proper heading hierarchy', () => {
      render(<GlassHeader title="Main Title" subtitle="Subtitle" />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Main Title');
    });
  });
});

describe('GlassHeaderCompact', () => {
  describe('Basic Rendering', () => {
    it('should render with title', () => {
      render(<GlassHeaderCompact title="Compact Title" />);
      expect(screen.getByText('Compact Title')).toBeInTheDocument();
    });

    it('should render as a header element', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should not support subtitle prop', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const subtitle = container.querySelector('.text-muted-foreground');
      expect(subtitle).not.toBeInTheDocument();
    });
  });

  describe('Compact Styling', () => {
    it('should have reduced height compared to regular header', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toHaveClass('h-12');
    });

    it('should have smaller text size', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const title = container.querySelector('h1');
      expect(title).toHaveClass('text-lg');
    });

    it('should apply same glassmorphism effects', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('backdrop-blur-md');
      expect(header).toHaveClass('bg-background/80');
    });
  });

  describe('Actions', () => {
    it('should render action buttons when provided', () => {
      render(
        <GlassHeaderCompact
          title="Test"
          actions={<button>Compact Action</button>}
        />
      );
      expect(screen.getByText('Compact Action')).toBeInTheDocument();
    });
  });

  describe('Sticky Positioning', () => {
    it('should be sticky by default', () => {
      const { container } = render(<GlassHeaderCompact title="Test" />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky');
      expect(header).toHaveClass('top-0');
      expect(header).toHaveClass('z-50');
    });

    it('should not be sticky when sticky=false', () => {
      const { container } = render(<GlassHeaderCompact title="Test" sticky={false} />);
      const header = container.querySelector('header');
      expect(header).not.toHaveClass('sticky');
    });
  });

  describe('Custom Styling', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <GlassHeaderCompact title="Test" className="compact-custom" />
      );
      const header = container.querySelector('header');
      expect(header).toHaveClass('compact-custom');
    });
  });
});
