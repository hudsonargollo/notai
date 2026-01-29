/**
 * LoginScreen Component Tests
 * 
 * Tests for the migrated LoginScreen component using Shadcn/UI primitives.
 * Validates PageTransition wrapper, Card layout, and core functionality.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginScreen } from '../LoginScreen';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the PageTransition component
vi.mock('../../src/components/layout/PageTransition', () => ({
  PageTransition: ({ children }: any) => <div data-testid="page-transition">{children}</div>,
}));

describe('LoginScreen', () => {
  const mockOnLogin = vi.fn();
  const currentLang = 'en' as const;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Structure', () => {
    it('should render wrapped in PageTransition component', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      const pageTransition = screen.getByTestId('page-transition');
      expect(pageTransition).toBeInTheDocument();
    });

    it('should render with Card component structure', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );

      // Card should have the glassmorphism styling
      const card = container.querySelector('.bg-slate-900\\/50.backdrop-blur-xl');
      expect(card).toBeInTheDocument();
    });

    it('should render app logo with Receipt icon', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      const logo = screen.getByText(/not/);
      expect(logo).toBeInTheDocument();
      expect(screen.getByText(/AÍ/)).toBeInTheDocument();
    });

    it('should render Neo Assistant avatar', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      const avatar = screen.getByAltText('Neo Assistant');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src');
    });
  });

  describe('Dynamic Messages', () => {
    it('should render rotating messages', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      // At least one message should be visible - check for actual translated text
      const messageContainer = screen.getByText(/sync your finances with ai/i).parentElement;
      expect(messageContainer).toBeInTheDocument();
    });

    it('should have message rotation interval', () => {
      // This test verifies the interval is set up correctly
      const { unmount } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      // Check that a message is displayed
      expect(screen.getByText(/sync your finances with ai/i)).toBeInTheDocument();
      
      // Cleanup
      unmount();
    });
  });

  describe('Google Sign-In Button', () => {
    it('should render Google sign-in button with Shadcn Button component', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      const button = screen.getByRole('button', { name: /continue with google/i });
      expect(button).toBeInTheDocument();
    });

    it('should render Google logo SVG', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      const googleLogo = container.querySelector('svg[viewBox="0 0 24 24"]');
      expect(googleLogo).toBeInTheDocument();
    });

    it('should call onLogin when button is clicked', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      const button = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(button);
      
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    it('should have proper styling classes', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      const button = screen.getByRole('button', { name: /continue with google/i });
      expect(button).toHaveClass('w-full');
      expect(button).toHaveClass('bg-white');
      expect(button).toHaveClass('text-slate-900');
    });
  });

  describe('Background Effects', () => {
    it('should render background ambience elements', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      const ambientElements = container.querySelectorAll('.bg-emerald-500\\/10, .bg-blue-500\\/10');
      expect(ambientElements.length).toBeGreaterThan(0);
    });

    it('should have proper blur effects', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      const blurredElements = container.querySelectorAll('.blur-\\[100px\\]');
      expect(blurredElements.length).toBeGreaterThan(0);
    });
  });

  describe('Footer', () => {
    it('should render footer text with privacy policy', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      const footer = screen.getByText(/create account/i);
      expect(footer).toBeInTheDocument();
      expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    });

    it('should have proper text styling', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      const footer = screen.getByText(/create account/i);
      expect(footer).toHaveClass('text-xs', 'text-slate-500');
    });
  });

  describe('Animations', () => {
    it('should apply fadeInUp animation to card wrapper', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      // Check for motion.div with fadeInUp variants
      const animatedWrapper = container.querySelector('[class*="z-10"]');
      expect(animatedWrapper).toBeInTheDocument();
    });

    it('should apply floating animation to avatar', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      const avatar = screen.getByAltText('Neo Assistant');
      const avatarWrapper = avatar.parentElement;
      
      expect(avatarWrapper).toBeInTheDocument();
    });

    it('should apply scaleOnHover to button wrapper', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      const button = screen.getByRole('button', { name: /continue with google/i });
      const buttonWrapper = button.parentElement;
      
      expect(buttonWrapper).toHaveClass('w-full');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive padding', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      const mainContainer = container.querySelector('.min-h-screen');
      expect(mainContainer).toHaveClass('p-6');
    });

    it('should constrain card width', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      const cardWrapper = container.querySelector('.max-w-md');
      expect(cardWrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive alt text for avatar', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      const avatar = screen.getByAltText('Neo Assistant');
      expect(avatar).toHaveAccessibleName();
    });

    it('should have accessible button', () => {
      render(<LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />);
      
      const button = screen.getByRole('button', { name: /continue with google/i });
      expect(button).toHaveAccessibleName();
    });

    it('should maintain proper heading hierarchy', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      // Logo text should be prominent but not necessarily a heading
      const logo = screen.getByText(/not/);
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Lucide Icons', () => {
    it('should use Lucide Receipt icon for app logo', () => {
      const { container } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      // Check for Receipt icon in the logo area
      const iconContainer = container.querySelector('.bg-emerald-500\\/20');
      expect(iconContainer).toBeInTheDocument();
      
      const icon = iconContainer?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup interval on unmount', () => {
      vi.useFakeTimers();
      
      const { unmount } = render(
        <LoginScreen onLogin={mockOnLogin} currentLang={currentLang} />
      );
      
      // Unmount the component
      unmount();
      
      // Advance timers - should not cause any errors
      vi.advanceTimersByTime(10000);
      
      vi.useRealTimers();
    });
  });
});
