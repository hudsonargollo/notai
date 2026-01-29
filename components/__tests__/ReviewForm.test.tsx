/**
 * ReviewForm Component Tests
 * 
 * Tests for the migrated ReviewForm component using Shadcn/UI primitives.
 * Validates form validation, accessibility, and core functionality.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReviewForm } from '../ReviewForm';
import { AIReceiptResponse, Expense } from '../../types';
import * as expenseService from '../../services/expenseService';

// Mock the services
vi.mock('../../services/expenseService', () => ({
  addExpense: vi.fn(),
  updateExpense: vi.fn(),
  getCategories: vi.fn(() => ['Food & Dining', 'Transport', 'Shopping', 'Other']),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ReviewForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();
  const currentLang = 'en' as const;

  const mockAIReceiptResponse: AIReceiptResponse = {
    merchant_name: 'Test Store',
    transaction_date: '2024-01-15',
    total_amount: 50.00,
    currency: 'BRL',
    category: 'Shopping',
    line_items: [
      { item: 'Item 1', price: 25.00, quantity: 1 },
      { item: 'Item 2', price: 25.00, quantity: 1 },
    ],
    summary_note: 'Test purchase',
  };

  const mockExpense: Expense = {
    id: 'test-id',
    user_id: 'user-123',
    created_at: '2024-01-15T10:00:00Z',
    merchant_name: 'Existing Store',
    amount: 75.50,
    category: 'Food & Dining',
    date: '2024-01-15',
    receipt_image_url: 'https://example.com/receipt.jpg',
    ai_summary: 'Existing expense',
    currency: 'BRL',
    line_items: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('New Expense (from AI Receipt)', () => {
    it('should render form with AI receipt data', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      expect(screen.getByText('Revisar')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Store')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
    });

    it('should display extracted amount', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      expect(screen.getByText('Valor Extraído')).toBeInTheDocument();
      expect(screen.getByText('50.00')).toBeInTheDocument();
    });

    it('should render all category buttons', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      expect(screen.getByText('Food & Dining')).toBeInTheDocument();
      expect(screen.getByText('Transport')).toBeInTheDocument();
      expect(screen.getByText('Shopping')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });

    it('should highlight selected category', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const shoppingButton = screen.getByText('Shopping');
      expect(shoppingButton).toHaveClass('bg-energy-500');
    });
  });

  describe('Existing Expense (Edit Mode)', () => {
    it('should render form with existing expense data', () => {
      render(
        <ReviewForm
          initialData={mockExpense}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      expect(screen.getByText('Editar')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Store')).toBeInTheDocument();
      expect(screen.getByText('75.50')).toBeInTheDocument();
    });

    it('should highlight correct category for existing expense', () => {
      render(
        <ReviewForm
          initialData={mockExpense}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const foodButton = screen.getByText('Food & Dining');
      expect(foodButton).toHaveClass('bg-energy-500');
    });
  });

  describe('Form Interactions', () => {
    it('should allow editing merchant name', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const merchantInput = screen.getByDisplayValue('Test Store') as HTMLInputElement;
      fireEvent.change(merchantInput, { target: { value: 'Updated Store' } });

      expect(merchantInput.value).toBe('Updated Store');
    });

    it('should allow editing date', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const dateInput = screen.getByDisplayValue('2024-01-15') as HTMLInputElement;
      fireEvent.change(dateInput, { target: { value: '2024-01-20' } });

      expect(dateInput.value).toBe('2024-01-20');
    });

    it('should allow changing category', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const transportButton = screen.getByText('Transport');
      fireEvent.click(transportButton);

      expect(transportButton).toHaveClass('bg-energy-500');
    });

    it('should allow editing amount when clicked', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const amountDisplay = screen.getByText('50.00');
      fireEvent.click(amountDisplay);

      // Should show input field
      const amountInput = screen.getByDisplayValue('50') as HTMLInputElement;
      expect(amountInput).toBeInTheDocument();
      expect(amountInput).toHaveAttribute('type', 'number');
    });

    it('should update amount value when edited', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const amountDisplay = screen.getByText('50.00');
      fireEvent.click(amountDisplay);

      const amountInput = screen.getByDisplayValue('50') as HTMLInputElement;
      fireEvent.change(amountInput, { target: { value: '75.50' } });

      expect(amountInput.value).toBe('75.50');
    });
  });

  describe('Form Submission', () => {
    it('should call addExpense for new expense', async () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const saveButton = screen.getByRole('button', { name: /salvar registro/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(expenseService.addExpense).toHaveBeenCalledWith(
          expect.objectContaining({
            merchant_name: 'Test Store',
            amount: 50.00,
            category: 'Shopping',
            currency: 'BRL',
          })
        );
        expect(mockOnSave).toHaveBeenCalled();
      });
    });

    it('should call updateExpense for existing expense', async () => {
      render(
        <ReviewForm
          initialData={mockExpense}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const saveButton = screen.getByRole('button', { name: /salvar registro/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(expenseService.updateExpense).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'test-id',
            merchant_name: 'Existing Store',
            amount: 75.50,
            category: 'Food & Dining',
          })
        );
        expect(mockOnSave).toHaveBeenCalled();
      });
    });

    it('should include modified data in submission', async () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      // Modify merchant name
      const merchantInput = screen.getByDisplayValue('Test Store');
      fireEvent.change(merchantInput, { target: { value: 'Modified Store' } });

      // Change category
      const foodButton = screen.getByText('Food & Dining');
      fireEvent.click(foodButton);

      const saveButton = screen.getByRole('button', { name: /salvar registro/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(expenseService.addExpense).toHaveBeenCalledWith(
          expect.objectContaining({
            merchant_name: 'Modified Store',
            category: 'Food & Dining',
          })
        );
      });
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty merchant name', async () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const merchantInput = screen.getByDisplayValue('Test Store');
      fireEvent.change(merchantInput, { target: { value: '' } });

      const saveButton = screen.getByRole('button', { name: /salvar registro/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/merchant name is required/i)).toBeInTheDocument();
      });

      expect(expenseService.addExpense).not.toHaveBeenCalled();
    });

    it('should show validation error for invalid amount', async () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      // Click to edit amount
      const amountDisplay = screen.getByText('50.00');
      fireEvent.click(amountDisplay);

      const amountInput = screen.getByDisplayValue('50');
      fireEvent.change(amountInput, { target: { value: '0' } });
      fireEvent.blur(amountInput);

      const saveButton = screen.getByRole('button', { name: /salvar registro/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
      });

      expect(expenseService.addExpense).not.toHaveBeenCalled();
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when back button is clicked', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const backButton = screen.getByRole('button', { name: '' });
      fireEvent.click(backButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Lucide Icons', () => {
    it('should use Lucide ArrowLeft icon in back button', () => {
      const { container } = render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const backButton = container.querySelector('button');
      const icon = backButton?.querySelector('svg');
      
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-6', 'w-6');
    });

    it('should use Lucide Save icon in submit button', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const saveButton = screen.getByRole('button', { name: /salvar registro/i });
      const icon = saveButton.querySelector('svg');
      
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('mr-3', 'h-6', 'w-6');
    });

    it('should use Lucide Edit2 icon for amount editing', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      // The Edit2 icon should be visible next to the amount display
      const amountDisplay = screen.getByText('50.00');
      const parent = amountDisplay.parentElement;
      const editIcon = parent?.querySelector('svg');
      
      expect(editIcon).toBeInTheDocument();
      expect(editIcon).toHaveClass('h-5', 'w-5');
    });
  });

  describe('Shadcn/UI Components', () => {
    it('should use Shadcn Button component for back button', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const backButton = screen.getAllByRole('button')[0];
      expect(backButton).toHaveClass('rounded-2xl');
    });

    it('should use Shadcn Input components for form fields', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const merchantInput = screen.getByDisplayValue('Test Store');
      expect(merchantInput).toHaveClass('rounded-2xl');
      
      const dateInput = screen.getByDisplayValue('2024-01-15');
      expect(dateInput).toHaveClass('rounded-2xl');
    });

    it('should use Shadcn Button components for category selection', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const categoryButtons = screen.getAllByRole('button').filter(
        button => button.textContent && ['Food & Dining', 'Transport', 'Shopping', 'Other'].includes(button.textContent)
      );

      expect(categoryButtons.length).toBe(4);
      categoryButtons.forEach(button => {
        expect(button).toHaveClass('rounded-xl');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      expect(screen.getByText('Local')).toBeInTheDocument();
      expect(screen.getByText('Data')).toBeInTheDocument();
      expect(screen.getByText('Categoria')).toBeInTheDocument();
    });

    it('should have accessible form inputs', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const merchantInput = screen.getByDisplayValue('Test Store');
      const dateInput = screen.getByDisplayValue('2024-01-15');

      expect(merchantInput).toBeInTheDocument();
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveAttribute('type', 'date');
    });

    it('should have accessible buttons', () => {
      render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const saveButton = screen.getByRole('button', { name: /salvar registro/i });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('Animation Integration', () => {
    it('should apply hover animation to save button', () => {
      const { container } = render(
        <ReviewForm
          initialData={mockAIReceiptResponse}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      // The save button should be wrapped in a motion.div
      const saveButtonWrapper = container.querySelector('.absolute.bottom-10 > div');
      expect(saveButtonWrapper).toBeInTheDocument();
    });
  });
});
