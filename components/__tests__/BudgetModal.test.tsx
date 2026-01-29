/**
 * BudgetModal Component Tests
 * 
 * Tests for the migrated BudgetModal component using Shadcn/UI primitives.
 * Validates responsive behavior, accessibility, and core functionality.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BudgetModal } from '../BudgetModal';
import * as expenseService from '../../services/expenseService';
import * as mediaQuery from '../../src/hooks/useMediaQuery';

// Mock the services
vi.mock('../../services/expenseService', () => ({
  saveBudget: vi.fn(),
  getBudgets: vi.fn(() => []),
  getCategories: vi.fn(() => ['food', 'transport', 'entertainment']),
}));

// Mock the useMediaQuery hook
vi.mock('../../src/hooks/useMediaQuery', () => ({
  useIsMobile: vi.fn(() => false),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('BudgetModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();
  const currentLang = 'en' as const;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Desktop Rendering (Dialog)', () => {
    beforeEach(() => {
      vi.mocked(mediaQuery.useIsMobile).mockReturnValue(false);
    });

    it('should render the modal with title', () => {
      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      expect(screen.getByText(/monthly budgets/i)).toBeInTheDocument();
    });

    it('should render category select with options', async () => {
      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      const selectTrigger = screen.getByRole('combobox', { name: /category/i });
      expect(selectTrigger).toBeInTheDocument();
    });

    it('should render amount input field', () => {
      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      const amountInput = screen.getByLabelText(/total amount/i);
      expect(amountInput).toBeInTheDocument();
      expect(amountInput).toHaveAttribute('type', 'number');
    });

    it('should render save button with icon', () => {
      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save budget/i });
      expect(saveButton).toBeInTheDocument();
    });
  });

  describe('Mobile Rendering (Sheet)', () => {
    beforeEach(() => {
      vi.mocked(mediaQuery.useIsMobile).mockReturnValue(true);
    });

    it('should render as sheet on mobile', () => {
      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      // Sheet should have the title
      expect(screen.getByText(/monthly budgets/i)).toBeInTheDocument();
    });

    it('should render visual handle indicator on mobile', () => {
      const { container } = render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      // Check for the handle indicator (div with specific classes)
      const handle = container.querySelector('.w-12.h-1\\.5.rounded-full.bg-muted');
      expect(handle).toBeInTheDocument();
    });
  });

  describe('Form Functionality', () => {
    beforeEach(() => {
      vi.mocked(mediaQuery.useIsMobile).mockReturnValue(false);
    });

    it('should update amount when input changes', () => {
      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      const amountInput = screen.getByLabelText(/total amount/i) as HTMLInputElement;
      fireEvent.change(amountInput, { target: { value: '500' } });

      expect(amountInput.value).toBe('500');
    });

    it('should call saveBudget and callbacks on form submit', async () => {
      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      const amountInput = screen.getByLabelText(/total amount/i);
      fireEvent.change(amountInput, { target: { value: '500' } });

      const saveButton = screen.getByRole('button', { name: /save budget/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(expenseService.saveBudget).toHaveBeenCalledWith({
          category: 'food',
          amount: 500,
        });
        expect(mockOnSave).toHaveBeenCalled();
      });
    });

    it('should load existing budget when category changes', () => {
      vi.mocked(expenseService.getBudgets).mockReturnValue([
        { category: 'food', amount: 300 },
        { category: 'transport', amount: 150 },
      ]);

      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      const amountInput = screen.getByLabelText(/total amount/i) as HTMLInputElement;
      
      // Initial value should be from the first category
      expect(amountInput.value).toBe('300');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.mocked(mediaQuery.useIsMobile).mockReturnValue(false);
    });

    it('should have proper ARIA labels on form inputs', () => {
      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      const categorySelect = screen.getByRole('combobox', { name: /category/i });
      const amountInput = screen.getByLabelText(/total amount/i);
      const saveButton = screen.getByRole('button', { name: /save budget/i });

      expect(categorySelect).toHaveAccessibleName();
      expect(amountInput).toHaveAccessibleName();
      expect(saveButton).toHaveAccessibleName();
    });

    it('should have descriptive text for screen readers', () => {
      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      const description = screen.getByText(/set monthly budgets for different expense categories/i);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('sr-only');
    });

    it('should have proper form field descriptions', () => {
      render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      const amountInput = screen.getByLabelText(/total amount/i);
      expect(amountInput).toHaveAttribute('aria-describedby', 'amount-description');
    });
  });

  describe('Lucide Icons', () => {
    beforeEach(() => {
      vi.mocked(mediaQuery.useIsMobile).mockReturnValue(false);
    });

    it('should use Lucide Save icon in button', () => {
      const { container } = render(
        <BudgetModal
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentLang={currentLang}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save budget/i });
      const icon = saveButton.querySelector('svg');
      
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-5', 'w-5', 'mr-2');
    });
  });
});
