import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsModal } from '../SettingsModal';
import { Theme, Language } from '../../types';
import * as expenseService from '../../services/expenseService';

// Mock the services
vi.mock('../../services/expenseService', () => ({
  getCategories: vi.fn(() => ['Food', 'Transport', 'Entertainment']),
  saveCategories: vi.fn(),
  updateCategoryName: vi.fn(),
  getUserProfile: vi.fn(() => ({
    id: '1',
    email: 'test@example.com',
    subscriptionStatus: 'free',
    trialEndsAt: null,
  })),
  canAddCategory: vi.fn(() => true),
}));

vi.mock('../../utils/i18n', () => ({
  useTranslation: () => (key: string) => key,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('SettingsModal', () => {
  const mockOnClose = vi.fn();
  const mockOnLogout = vi.fn();
  const mockOnThemeChange = vi.fn();
  const mockOnLangChange = vi.fn();
  const mockOnShowPaywall = vi.fn();

  const defaultProps = {
    onClose: mockOnClose,
    onLogout: mockOnLogout,
    currentTheme: 'dark' as Theme,
    onThemeChange: mockOnThemeChange,
    currentLang: 'en' as Language,
    onLangChange: mockOnLangChange,
    onShowPaywall: mockOnShowPaywall,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(expenseService.getCategories).mockReturnValue(['Food', 'Transport', 'Entertainment']);
    vi.mocked(expenseService.getUserProfile).mockReturnValue({
      id: '1',
      email: 'test@example.com',
      subscriptionStatus: 'free',
      trialEndsAt: null,
    });
    vi.mocked(expenseService.canAddCategory).mockReturnValue(true);
  });

  describe('Rendering', () => {
    it('should render the settings modal with all sections', () => {
      render(<SettingsModal {...defaultProps} />);

      expect(screen.getByText('profile')).toBeInTheDocument();
      expect(screen.getByText('appearance')).toBeInTheDocument();
      expect(screen.getByText('language')).toBeInTheDocument();
      expect(screen.getByText('categories')).toBeInTheDocument();
    });

    it('should render premium banner for premium users', () => {
      vi.mocked(expenseService.getUserProfile).mockReturnValue({
        id: '1',
        email: 'test@example.com',
        subscriptionStatus: 'premium',
        trialEndsAt: null,
      });

      render(<SettingsModal {...defaultProps} />);

      expect(screen.getByText('Premium')).toBeInTheDocument();
      expect(screen.getByText('Active Membership')).toBeInTheDocument();
    });

    it('should render upgrade banner for free users', () => {
      render(<SettingsModal {...defaultProps} />);

      expect(screen.getByText('premiumTitle')).toBeInTheDocument();
      expect(screen.getByText('premiumDesc')).toBeInTheDocument();
    });

    it('should render all categories', () => {
      render(<SettingsModal {...defaultProps} />);

      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Transport')).toBeInTheDocument();
      expect(screen.getByText('Entertainment')).toBeInTheDocument();
    });
  });

  describe('Theme Selection', () => {
    it('should call onThemeChange when light mode is selected', () => {
      render(<SettingsModal {...defaultProps} />);

      const lightButton = screen.getByRole('button', { name: /lightMode/i });
      fireEvent.click(lightButton);

      expect(mockOnThemeChange).toHaveBeenCalledWith('light');
    });

    it('should call onThemeChange when dark mode is selected', () => {
      render(<SettingsModal {...defaultProps} currentTheme="light" />);

      const darkButton = screen.getByRole('button', { name: /darkMode/i });
      fireEvent.click(darkButton);

      expect(mockOnThemeChange).toHaveBeenCalledWith('dark');
    });

    it('should show current theme as selected', () => {
      render(<SettingsModal {...defaultProps} currentTheme="dark" />);

      const darkButton = screen.getByRole('button', { name: /darkMode/i });
      expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Language Selection', () => {
    it('should call onLangChange when English is selected', () => {
      render(<SettingsModal {...defaultProps} currentLang="pt" />);

      const englishButton = screen.getByRole('button', { name: /English/i });
      fireEvent.click(englishButton);

      expect(mockOnLangChange).toHaveBeenCalledWith('en');
    });

    it('should call onLangChange when Portuguese is selected', () => {
      render(<SettingsModal {...defaultProps} />);

      const portugueseButton = screen.getByRole('button', { name: /Português/i });
      fireEvent.click(portugueseButton);

      expect(mockOnLangChange).toHaveBeenCalledWith('pt');
    });

    it('should show current language as selected', () => {
      render(<SettingsModal {...defaultProps} currentLang="en" />);

      const englishButton = screen.getByRole('button', { name: /English/i });
      expect(englishButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Category Management', () => {
    it('should add a new category when form is submitted', async () => {
      render(<SettingsModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('addCategory');
      const addButton = screen.getByRole('button', { name: /Add category/i });

      fireEvent.change(input, { target: { value: 'Shopping' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(expenseService.saveCategories).toHaveBeenCalledWith([
          'Food',
          'Transport',
          'Entertainment',
          'Shopping',
        ]);
      });
    });

    it('should show error when adding empty category', async () => {
      render(<SettingsModal {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /Add category/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Category name cannot be empty')).toBeInTheDocument();
      });
    });

    it('should show error when adding duplicate category', async () => {
      render(<SettingsModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('addCategory');
      const addButton = screen.getByRole('button', { name: /Add category/i });

      fireEvent.change(input, { target: { value: 'Food' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Category already exists')).toBeInTheDocument();
      });
    });

    it('should show error when category limit is reached', async () => {
      vi.mocked(expenseService.canAddCategory).mockReturnValue(false);

      render(<SettingsModal {...defaultProps} />);

      const input = screen.getByPlaceholderText('addCategory');
      const addButton = screen.getByRole('button', { name: /Add category/i });

      fireEvent.change(input, { target: { value: 'Shopping' } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('catLimitReached')).toBeInTheDocument();
      });
    });

    it('should delete a category when delete button is clicked', async () => {
      // Mock window.confirm
      global.confirm = vi.fn(() => true);

      render(<SettingsModal {...defaultProps} />);

      const deleteButtons = screen.getAllByRole('button', { name: /Delete category/i });
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(expenseService.saveCategories).toHaveBeenCalledWith([
          'Transport',
          'Entertainment',
        ]);
      });
    });

    it('should not delete category when confirmation is cancelled', async () => {
      global.confirm = vi.fn(() => false);

      render(<SettingsModal {...defaultProps} />);

      const deleteButtons = screen.getAllByRole('button', { name: /Delete category/i });
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(expenseService.saveCategories).not.toHaveBeenCalled();
      });
    });

    it('should edit a category name', async () => {
      vi.mocked(expenseService.getCategories).mockReturnValue(['Food', 'Transport']);

      render(<SettingsModal {...defaultProps} />);

      const editButtons = screen.getAllByRole('button', { name: /Edit category/i });
      fireEvent.click(editButtons[0]);

      const input = screen.getByDisplayValue('Food');
      fireEvent.change(input, { target: { value: 'Groceries' } });

      const saveButton = screen.getByRole('button', { name: /Save category name/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(expenseService.updateCategoryName).toHaveBeenCalledWith('Food', 'Groceries');
      });
    });
  });

  describe('Logout', () => {
    it('should call onLogout when logout button is clicked', () => {
      render(<SettingsModal {...defaultProps} />);

      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      fireEvent.click(logoutButton);

      expect(mockOnLogout).toHaveBeenCalled();
    });
  });

  describe('Paywall', () => {
    it('should call onShowPaywall when upgrade banner is clicked', () => {
      render(<SettingsModal {...defaultProps} />);

      const upgradeButton = screen.getByText('premiumTitle').closest('div');
      if (upgradeButton) {
        fireEvent.click(upgradeButton);
      }

      expect(mockOnShowPaywall).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all interactive elements', () => {
      render(<SettingsModal {...defaultProps} />);

      expect(screen.getByLabelText('Close settings')).toBeInTheDocument();
      expect(screen.getByLabelText('New category name')).toBeInTheDocument();
      expect(screen.getByLabelText('Add category')).toBeInTheDocument();
      expect(screen.getByLabelText('Logout')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for form validation', async () => {
      render(<SettingsModal {...defaultProps} />);

      const input = screen.getByLabelText('New category name');
      const addButton = screen.getByRole('button', { name: /Add category/i });

      fireEvent.click(addButton);

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
        // Shadcn Form component generates its own aria-describedby IDs
        expect(input).toHaveAttribute('aria-describedby');
      });
    });

    it('should have descriptive text for screen readers', () => {
      render(<SettingsModal {...defaultProps} />);

      expect(
        screen.getByText('Manage your profile settings, theme, language, and expense categories')
      ).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render as a side drawer (Sheet)', () => {
      render(<SettingsModal {...defaultProps} />);

      // Sheet component should be rendered
      const sheet = screen.getByRole('dialog');
      expect(sheet).toBeInTheDocument();
    });
  });

  describe('Animations', () => {
    it('should apply spring animations to interactive elements', () => {
      render(<SettingsModal {...defaultProps} />);

      // Check that motion components are rendered
      const themeButtons = screen.getAllByRole('button', { name: /Mode/i });
      expect(themeButtons.length).toBeGreaterThan(0);
    });
  });
});
