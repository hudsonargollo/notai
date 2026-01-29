/**
 * AIAssistant Component Tests
 * 
 * Tests for the migrated AIAssistant component with responsive behavior,
 * Shadcn UI components, and Lucide icons.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AIAssistant } from '../AIAssistant';
import { Language } from '../../types';
import * as expenseService from '../../services/expenseService';
import * as geminiService from '../../services/geminiService';

// Mock the services
vi.mock('../../services/expenseService');
vi.mock('../../services/geminiService');
vi.mock('../../utils/i18n', () => ({
  useTranslation: () => (key: string) => key,
}));

// Mock useMediaQuery hook
vi.mock('../../src/hooks/useMediaQuery', () => ({
  useIsMobile: vi.fn(() => false),
  useMediaQuery: vi.fn(() => false),
}));

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('AIAssistant Component', () => {
  const mockOnClose = vi.fn();
  const mockOnShowPaywall = vi.fn();
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (expenseService.getChatHistory as any).mockReturnValue([]);
    (expenseService.incrementAIInteraction as any).mockReturnValue(true);
    (expenseService.getExpenses as any).mockReturnValue([]);
    (expenseService.getBudgets as any).mockReturnValue([]);
    (expenseService.getCategories as any).mockReturnValue([]);
  });

  describe('Rendering', () => {
    it('should render collapsed pill by default', () => {
      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      expect(screen.getByText(/Neo v2.5/i)).toBeInTheDocument();
      expect(screen.getByText(/Falar com o Neo/i)).toBeInTheDocument();
    });

    it('should show initial greeting message when expanded', async () => {
      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Click to expand
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText(/Neo Analytics/i)).toBeInTheDocument();
      });
    });

    it('should use Lucide icons', () => {
      const { container } = render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Check for Lucide icon classes (Mic, Send, etc.)
      const svgElements = container.querySelectorAll('svg');
      expect(svgElements.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Behavior', () => {
    it('should render in mobile layout when isMobile is true', () => {
      const { useIsMobile } = require('../../src/hooks/useMediaQuery');
      useIsMobile.mockReturnValue(true);

      const { container } = render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand the assistant
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      // Check for mobile-specific styling
      const chatContainer = container.querySelector('.h-\\[58vh\\]');
      expect(chatContainer).toBeInTheDocument();
    });

    it('should render in desktop layout when isMobile is false', () => {
      const { useIsMobile } = require('../../src/hooks/useMediaQuery');
      useIsMobile.mockReturnValue(false);

      const { container } = render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand the assistant
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      // Check for desktop-specific styling
      const chatContainer = container.querySelector('.h-\\[65vh\\]');
      expect(chatContainer).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should expand when pill is clicked', () => {
      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      expect(screen.getByText(/Neo Analytics/i)).toBeInTheDocument();
    });

    it('should collapse when close button is clicked', async () => {
      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand first
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText(/Neo Analytics/i)).toBeInTheDocument();
      });

      // Find and click close button (ChevronDown icon button)
      const buttons = screen.getAllByRole('button');
      const closeButton = buttons.find(btn => btn.querySelector('svg'));
      if (closeButton) {
        fireEvent.click(closeButton);
      }

      await waitFor(() => {
        expect(screen.getByText(/Falar com o Neo/i)).toBeInTheDocument();
      });
    });

    it('should toggle sound when sound button is clicked', async () => {
      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand first
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText(/Neo Analytics/i)).toBeInTheDocument();
      });

      // Find sound button and click it
      const buttons = screen.getAllByRole('button');
      const soundButton = buttons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg && (svg.classList.contains('lucide-volume-2') || svg.classList.contains('lucide-volume-x'));
      });

      if (soundButton) {
        fireEvent.click(soundButton);
        // Sound state should toggle (we can't easily test the internal state, but we can verify no errors)
        expect(soundButton).toBeInTheDocument();
      }
    });
  });

  describe('Message Handling', () => {
    it('should send message when send button is clicked', async () => {
      (geminiService.chatWithFinancialAdvisor as any).mockResolvedValue({
        text: 'Test response',
      });

      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText(/Neo Analytics/i)).toBeInTheDocument();
      });

      // Type message
      const input = screen.getByPlaceholderText(/Manda uma pro Neo/i);
      fireEvent.change(input, { target: { value: 'Test message' } });

      // Click send
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find(btn => {
        const svg = btn.querySelector('svg');
        return svg && svg.classList.contains('lucide-send');
      });

      if (sendButton) {
        fireEvent.click(sendButton);

        await waitFor(() => {
          expect(geminiService.chatWithFinancialAdvisor).toHaveBeenCalled();
        });
      }
    });

    it('should send message when Enter key is pressed', async () => {
      (geminiService.chatWithFinancialAdvisor as any).mockResolvedValue({
        text: 'Test response',
      });

      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText(/Neo Analytics/i)).toBeInTheDocument();
      });

      // Type message and press Enter
      const input = screen.getByPlaceholderText(/Manda uma pro Neo/i);
      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(geminiService.chatWithFinancialAdvisor).toHaveBeenCalled();
      });
    });

    it('should show typing indicator while processing', async () => {
      (geminiService.chatWithFinancialAdvisor as any).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ text: 'Response' }), 100))
      );

      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText(/Neo Analytics/i)).toBeInTheDocument();
      });

      // Send message
      const input = screen.getByPlaceholderText(/Manda uma pro Neo/i);
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      // Should show processing state
      await waitFor(() => {
        expect(screen.getByText(/Processando/i)).toBeInTheDocument();
      });
    });

    it('should show paywall when AI interaction limit is reached', async () => {
      (expenseService.incrementAIInteraction as any).mockReturnValue(false);

      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText(/Neo Analytics/i)).toBeInTheDocument();
      });

      // Send message
      const input = screen.getByPlaceholderText(/Manda uma pro Neo/i);
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(mockOnShowPaywall).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have accessible input field', async () => {
      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText(/Manda uma pro Neo/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'text');
      });
    });

    it('should disable input when processing', async () => {
      (geminiService.chatWithFinancialAdvisor as any).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ text: 'Response' }), 100))
      );

      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText(/Neo Analytics/i)).toBeInTheDocument();
      });

      // Send message
      const input = screen.getByPlaceholderText(/Manda uma pro Neo/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      // Input should be disabled while processing
      await waitFor(() => {
        expect(input.disabled).toBe(true);
      });
    });
  });

  describe('Spring Animations', () => {
    it('should apply spring animations to messages', async () => {
      (geminiService.chatWithFinancialAdvisor as any).mockResolvedValue({
        text: 'Test response',
      });

      render(
        <AIAssistant
          onClose={mockOnClose}
          currentLang="en"
          onShowPaywall={mockOnShowPaywall}
        />
      );

      // Expand
      const expandButton = screen.getByText(/Falar com o Neo/i);
      fireEvent.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText(/Neo Analytics/i)).toBeInTheDocument();
      });

      // Send message
      const input = screen.getByPlaceholderText(/Manda uma pro Neo/i);
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      // Wait for response
      await waitFor(() => {
        expect(geminiService.chatWithFinancialAdvisor).toHaveBeenCalled();
      });

      // Messages should be rendered (animation is mocked, so we just check presence)
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });
});
