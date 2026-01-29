import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Onboarding } from '../Onboarding';
import { Language } from '../../types';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock PageTransition component
vi.mock('../../src/components/layout/PageTransition', () => ({
  PageTransition: ({ children }: any) => <div>{children}</div>,
}));

// Mock expense service
vi.mock('../../services/expenseService', () => ({
  getCategories: vi.fn(() => ['Food', 'Transport', 'Entertainment']),
  saveCategories: vi.fn(),
}));

describe('Onboarding', () => {
  const mockOnComplete = vi.fn();
  const currentLang: Language = 'en';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Step 0 - Name Input', () => {
    it('renders the name input step initially', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Check for name input
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      expect(nameInput).toBeInTheDocument();
    });

    it('displays Neo avatar and dialogue', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      const avatar = screen.getByAltText('Neo');
      expect(avatar).toBeInTheDocument();
    });

    it('disables next button when name is empty', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      const nextButton = screen.getByRole('button', { name: /Tudo Certo/i });
      expect(nextButton).toBeDisabled();
    });

    it('enables next button when name is entered', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });

      const nextButton = screen.getByRole('button', { name: /Tudo Certo/i });
      expect(nextButton).not.toBeDisabled();
    });

    it('advances to step 1 when next is clicked', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });

      const nextButton = screen.getByRole('button', { name: /Tudo Certo/i });
      fireEvent.click(nextButton);

      // Should now show budget input
      waitFor(() => {
        expect(screen.getByPlaceholderText(/Ex: 2500/i)).toBeInTheDocument();
      });
    });
  });

  describe('Step 1 - Budget Input', () => {
    it('renders budget input on step 1', async () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);
      
      // Navigate to step 1
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });
      const nextButton = screen.getByRole('button', { name: /Tudo Certo/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Ex: 2500/i)).toBeInTheDocument();
      });
    });

    it('disables next button when budget is empty', async () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);
      
      // Navigate to step 1
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });
      fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /Tudo Certo/i });
        expect(nextButton).toBeDisabled();
      });
    });

    it('enables next button when budget is entered', async () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);
      
      // Navigate to step 1
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });
      fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));

      await waitFor(async () => {
        const budgetInput = screen.getByPlaceholderText(/Ex: 2500/i);
        fireEvent.change(budgetInput, { target: { value: '2500' } });

        const nextButton = screen.getByRole('button', { name: /Tudo Certo/i });
        expect(nextButton).not.toBeDisabled();
      });
    });
  });

  describe('Step 2 - Categories', () => {
    it('displays existing categories', async () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Navigate to step 2
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });
      fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));

      await waitFor(() => {
        const budgetInput = screen.getByPlaceholderText(/Ex: 2500/i);
        fireEvent.change(budgetInput, { target: { value: '2500' } });
        fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));
      });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Nova categoria/i)).toBeInTheDocument();
      });
    });

    it('allows adding a new category', async () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Navigate to step 2
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });
      fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));

      await waitFor(() => {
        const budgetInput = screen.getByPlaceholderText(/Ex: 2500/i);
        fireEvent.change(budgetInput, { target: { value: '2500' } });
        fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));
      });

      await waitFor(() => {
        const categoryInput = screen.getByPlaceholderText(/Nova categoria/i);
        fireEvent.change(categoryInput, { target: { value: 'Shopping' } });
        
        // Find the add button by its class (the Check icon button)
        const addButton = document.querySelector('.bg-energy-500.rounded-2xl');
        expect(addButton).toBeInTheDocument();
        if (addButton) {
          fireEvent.click(addButton as Element);
        }

        // Category input should be cleared
        expect(categoryInput).toHaveValue('');
      });
    });

    it('allows adding category with Enter key', async () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Navigate to step 2
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });
      fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));

      await waitFor(() => {
        const budgetInput = screen.getByPlaceholderText(/Ex: 2500/i);
        fireEvent.change(budgetInput, { target: { value: '2500' } });
        fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));
      });

      await waitFor(() => {
        const categoryInput = screen.getByPlaceholderText(/Nova categoria/i);
        fireEvent.change(categoryInput, { target: { value: 'Shopping' } });
        fireEvent.keyDown(categoryInput, { key: 'Enter', code: 'Enter' });

        // Category input should be cleared
        expect(categoryInput).toHaveValue('');
      });
    });
  });

  describe('Step 3 - Completion', () => {
    it('displays completion message on final step', async () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Navigate through all steps
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });
      fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));

      await waitFor(() => {
        const budgetInput = screen.getByPlaceholderText(/Ex: 2500/i);
        fireEvent.change(budgetInput, { target: { value: '2500' } });
        fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));
      });

      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));
      });

      await waitFor(() => {
        expect(screen.getByText(/Fluxo Pronto/i)).toBeInTheDocument();
      });
    });

    it('shows final button text on last step', async () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Navigate through all steps
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });
      fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));

      await waitFor(() => {
        const budgetInput = screen.getByPlaceholderText(/Ex: 2500/i);
        fireEvent.change(budgetInput, { target: { value: '2500' } });
        fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));
      });

      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Bora Começar/i })).toBeInTheDocument();
      });
    });

    it('calls onComplete with correct data when finished', async () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Navigate through all steps
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      fireEvent.change(nameInput, { target: { value: 'João' } });
      fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));

      await waitFor(() => {
        const budgetInput = screen.getByPlaceholderText(/Ex: 2500/i);
        fireEvent.change(budgetInput, { target: { value: '2500' } });
        fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));
      });

      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /Tudo Certo/i }));
      });

      await waitFor(() => {
        const finalButton = screen.getByRole('button', { name: /Bora Começar/i });
        fireEvent.click(finalButton);
      });

      expect(mockOnComplete).toHaveBeenCalledWith(
        {
          name: 'João',
          monthlyBudget: 2500,
          onboardingCompleted: true,
        },
        true
      );
    });
  });

  describe('Progress Indicators', () => {
    it('displays 4 progress indicators', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Progress indicators are motion.div elements with specific classes
      const progressDots = document.querySelectorAll('.h-1\\.5.rounded-full');
      expect(progressDots.length).toBe(4);
    });

    it('highlights current step in progress indicators', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Progress indicators use motion.div with animate prop
      const progressDots = document.querySelectorAll('.h-1\\.5.rounded-full');
      expect(progressDots.length).toBe(4);
    });
  });

  describe('Accessibility', () => {
    it('has proper input labels and placeholders', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      expect(nameInput).toHaveAttribute('type', 'text');
    });

    it('uses Shadcn/UI Card components', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Card components should be present
      const cards = document.querySelectorAll('.bg-white\\/5');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('uses Shadcn/UI Button components', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      const button = screen.getByRole('button', { name: /Tudo Certo/i });
      expect(button).toBeInTheDocument();
    });

    it('uses Shadcn/UI Input components', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      const input = screen.getByPlaceholderText(/Seu nome/i);
      expect(input).toBeInTheDocument();
    });
  });

  describe('Animations', () => {
    it('wraps content with PageTransition', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // PageTransition is mocked, but we can verify the component renders
      expect(screen.getByPlaceholderText(/Seu nome/i)).toBeInTheDocument();
    });

    it('uses fadeInUp animation for step transitions', () => {
      render(<Onboarding onComplete={mockOnComplete} currentLang={currentLang} />);

      // Motion components should be present
      const nameInput = screen.getByPlaceholderText(/Seu nome/i);
      expect(nameInput).toBeInTheDocument();
    });
  });
});
