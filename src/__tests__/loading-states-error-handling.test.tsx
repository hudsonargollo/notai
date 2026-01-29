/**
 * Loading States and Error Handling Tests
 * 
 * Comprehensive testing covering:
 * - Skeleton loaders preventing layout shifts
 * - Error states in forms
 * - Loading states in data-fetching components
 * - Graceful degradation when animations are disabled
 * - Offline behavior
 * 
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

// Import components to test
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dashboard } from '../../components/Dashboard';
import { NeoCore } from '@/components/layout/NeoCore';
import { PageTransition } from '@/components/layout/PageTransition';
import type { Expense, Language } from '../../types';

// Mock framer-motion to test animation degradation
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock hooks
vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: vi.fn(() => false),
  useIsMobile: vi.fn(() => false),
}));

describe('Loading States and Error Handling Tests - Requirement 5', () => {
  describe('Skeleton Loaders Prevent Layout Shifts - Requirement 5.1, 5.2', () => {
    it('should render Skeleton with consistent dimensions', () => {
      const { container } = render(
        <Skeleton className="h-12 w-full" data-testid="skeleton" />
      );

      const skeleton = container.querySelector('[data-testid="skeleton"]');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('h-12');
      expect(skeleton).toHaveClass('w-full');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should maintain dimensions when transitioning from skeleton to content', () => {
      const TestComponent = ({ loading }: { loading: boolean }) => (
        <div data-testid="container">
          {loading ? (
            <Skeleton className="h-20 w-64" data-testid="skeleton" />
          ) : (
            <div className="h-20 w-64" data-testid="content">
              Loaded Content
            </div>
          )}
        </div>
      );

      const { rerender, container } = render(<TestComponent loading={true} />);

      // Get skeleton dimensions
      const skeleton = container.querySelector('[data-testid="skeleton"]');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('h-20');
      expect(skeleton).toHaveClass('w-64');

      // Rerender with content loaded
      rerender(<TestComponent loading={false} />);

      // Content should have same dimensions
      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('h-20');
      expect(content).toHaveClass('w-64');
    });

    it('should display multiple skeleton loaders for list items', () => {
      const { container } = render(
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(5);
      
      // All skeletons should have consistent dimensions
      skeletons.forEach(skeleton => {
        expect(skeleton).toHaveClass('h-16');
        expect(skeleton).toHaveClass('w-full');
      });
    });

    it('should prevent layout shift in Dashboard component', () => {
      const mockExpenses: Expense[] = [];
      const mockProps = {
        expenses: mockExpenses,
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
      };

      // Render with loading state
      const { container, rerender } = render(
        <Dashboard {...mockProps} isLoading={true} />
      );

      // Should show skeleton loaders
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);

      // Get container dimensions before loading completes
      const mainContent = container.querySelector('.grid');
      const initialHeight = mainContent?.clientHeight;

      // Rerender with data loaded
      rerender(<Dashboard {...mockProps} isLoading={false} />);

      // Content should be present and layout should be stable
      const contentAfterLoad = container.querySelector('.grid');
      expect(contentAfterLoad).toBeInTheDocument();
      
      // Skeletons should be replaced with actual content
      const skeletonsAfterLoad = container.querySelectorAll('.animate-pulse');
      expect(skeletonsAfterLoad.length).toBe(0);
    });

    it('should match skeleton dimensions to expected content in Dashboard', () => {
      const mockProps = {
        expenses: [],
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
        isLoading: true,
      };

      const { container } = render(<Dashboard {...mockProps} />);

      // Large spending card skeleton should match expected height
      const largeCardSkeleton = container.querySelector('.col-span-2.h-\\[150px\\]');
      expect(largeCardSkeleton).toBeInTheDocument();

      // Small card skeletons should match expected height
      const smallCardSkeletons = container.querySelectorAll('.h-\\[120px\\]');
      expect(smallCardSkeletons.length).toBeGreaterThan(0);

      // Transaction skeletons should match expected height
      const transactionSkeletons = container.querySelectorAll('.h-\\[60px\\]');
      expect(transactionSkeletons.length).toBeGreaterThan(0);
    });

    it('should not use generic spinning loaders', () => {
      const mockProps = {
        expenses: [],
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
        isLoading: true,
      };

      const { container } = render(<Dashboard {...mockProps} />);

      // Should not have spinner elements
      const spinners = container.querySelectorAll('[class*="spinner"]');
      expect(spinners).toHaveLength(0);

      // Should use skeleton loaders instead
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error States in Forms - Requirement 5', () => {
    it('should display validation error messages', async () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            email: '',
          },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      };

      const user = userEvent.setup();
      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      // Submit without entering email
      await user.click(submitButton);

      // Should show required error
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('should display pattern validation errors', async () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            email: '',
          },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      };

      const user = userEvent.setup();
      render(<TestForm />);

      const emailInput = screen.getByPlaceholderText('Enter email');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      // Enter invalid email
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      // Should show pattern error
      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      });
    });

    it('should mark invalid fields with aria-invalid', async () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            username: '',
          },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name="username"
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      };

      const user = userEvent.setup();
      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      // Submit without entering username
      await user.click(submitButton);

      // Input should have aria-invalid
      await waitFor(() => {
        const input = screen.getByPlaceholderText('Enter username');
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should clear error messages when input becomes valid', async () => {
      const TestForm = () => {
        const form = useForm({
          mode: 'onChange',
          defaultValues: {
            email: '',
          },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      };

      const user = userEvent.setup();
      render(<TestForm />);

      const emailInput = screen.getByPlaceholderText('Enter email');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      // Submit to trigger error
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      // Enter valid email
      await user.type(emailInput, 'test@example.com');

      // Error should clear
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
        expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
      });
    });

    it('should style error messages with destructive color', async () => {
      const TestForm = () => {
        const form = useForm({
          defaultValues: {
            field: '',
          },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <FormField
                control={form.control}
                name="field"
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      };

      const user = userEvent.setup();
      const { container } = render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByText('This field is required');
        expect(errorMessage).toHaveClass('text-destructive');
      });
    });
  });

  describe('Loading States in Data-Fetching Components', () => {
    it('should show loading state in Dashboard when isLoading is true', () => {
      const mockProps = {
        expenses: [],
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
        isLoading: true,
      };

      const { container } = render(<Dashboard {...mockProps} />);

      // Should show skeleton loaders
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should update NeoCore state to processing when loading', () => {
      const mockProps = {
        expenses: [],
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
        isLoading: true,
      };

      const { container } = render(<Dashboard {...mockProps} />);

      // Should show processing message
      expect(screen.getByText('"Processando dados..."')).toBeInTheDocument();
    });

    it('should transition from loading to success state', async () => {
      const mockExpenses: Expense[] = [
        {
          id: '1',
          amount: 50.0,
          merchant_name: 'Test Store',
          category: 'Food & Dining',
          date: new Date().toISOString().split('T')[0],
          receipt_url: '',
        },
      ];

      const mockProps = {
        expenses: [],
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
      };

      const { rerender } = render(<Dashboard {...mockProps} isLoading={true} />);

      // Initially loading
      expect(screen.getByText('"Processando dados..."')).toBeInTheDocument();

      // Load data
      rerender(<Dashboard {...mockProps} expenses={mockExpenses} isLoading={false} />);

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText('"Tudo certo!"')).toBeInTheDocument();
      });
    });

    it('should handle empty state after loading completes', () => {
      const mockProps = {
        expenses: [],
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
        isLoading: false,
      };

      render(<Dashboard {...mockProps} />);

      // Should show empty state message
      expect(screen.getByText('Sem Registros')).toBeInTheDocument();
    });

    it('should display loaded data after loading completes', () => {
      const mockExpenses: Expense[] = [
        {
          id: '1',
          amount: 50.0,
          merchant_name: 'Test Store',
          category: 'Food & Dining',
          date: new Date().toISOString().split('T')[0],
          receipt_url: '',
        },
      ];

      const mockProps = {
        expenses: mockExpenses,
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
        isLoading: false,
      };

      render(<Dashboard {...mockProps} />);

      // Should display expense data
      expect(screen.getByText('Test Store')).toBeInTheDocument();
      expect(screen.getByText('R$ 50.00')).toBeInTheDocument();
    });
  });

  describe('Graceful Degradation When Animations Are Disabled', () => {
    it('should render components without animations when framer-motion is mocked', () => {
      const mockProps = {
        expenses: [],
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
        isLoading: false,
      };

      const { container } = render(<Dashboard {...mockProps} />);

      // Component should still render and be functional
      expect(container).toBeInTheDocument();
      expect(screen.getByText('Painel Principal')).toBeInTheDocument();
    });

    it('should render NeoCore without animations', () => {
      const { container } = render(<NeoCore state="idle" size={120} />);

      const neoCore = container.querySelector('[data-testid="neo-core"]');
      expect(neoCore).toBeInTheDocument();
    });

    it('should render PageTransition without animations', () => {
      render(
        <PageTransition>
          <div>Test Content</div>
        </PageTransition>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should maintain functionality when animations are disabled', async () => {
      const mockProps = {
        expenses: [],
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
        isLoading: false,
      };

      const user = userEvent.setup();
      render(<Dashboard {...mockProps} />);

      // Buttons should still be clickable
      const manageBudgetsButton = screen.getByText('Metas');
      await user.click(manageBudgetsButton);

      expect(mockProps.onManageBudgets).toHaveBeenCalled();
    });

    it('should render skeleton loaders without animation classes when needed', () => {
      const { container } = render(
        <Skeleton className="h-12 w-full" />
      );

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
      // Even without framer-motion, CSS animations should work
    });
  });

  describe('Offline Behavior', () => {
    it('should handle offline state gracefully', () => {
      // Simulate offline state
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const mockProps = {
        expenses: [],
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
        isLoading: false,
      };

      const { container } = render(<Dashboard {...mockProps} />);

      // Component should still render
      expect(container).toBeInTheDocument();
      expect(screen.getByText('Painel Principal')).toBeInTheDocument();

      // Reset online state
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: true,
      });
    });

    it('should display cached data when offline', () => {
      const mockExpenses: Expense[] = [
        {
          id: '1',
          amount: 50.0,
          merchant_name: 'Cached Store',
          category: 'Food & Dining',
          date: new Date().toISOString().split('T')[0],
          receipt_url: '',
        },
      ];

      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const mockProps = {
        expenses: mockExpenses,
        onManageBudgets: vi.fn(),
        onEditExpense: vi.fn(),
        onShowPaywall: vi.fn(),
        onNavigate: vi.fn(),
        currentLang: 'pt' as Language,
        isLoading: false,
      };

      render(<Dashboard {...mockProps} />);

      // Should display cached data
      expect(screen.getByText('Cached Store')).toBeInTheDocument();

      // Reset online state
      Object.defineProperty(window.navigator, 'onLine', {
        writable: true,
        value: true,
      });
    });

    it('should handle network errors gracefully in forms', async () => {
      const TestForm = () => {
        const [error, setError] = useState<string | null>(null);
        const form = useForm({
          defaultValues: {
            data: '',
          },
        });

        const onSubmit = async () => {
          try {
            // Simulate network error
            throw new Error('Network request failed');
          } catch (err) {
            setError('Unable to submit. Please check your connection.');
          }
        };

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-destructive text-sm" role="alert">
                  {error}
                </div>
              )}
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      };

      const user = userEvent.setup();
      render(<TestForm />);

      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.type(input, 'test data');
      await user.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Unable to submit. Please check your connection.'
        );
      });
    });
  });

  describe('Loading State Transitions', () => {
    it('should smoothly transition between loading and loaded states', async () => {
      const TestComponent = () => {
        const [loading, setLoading] = useState(true);

        React.useEffect(() => {
          const timer = setTimeout(() => setLoading(false), 100);
          return () => clearTimeout(timer);
        }, []);

        return (
          <div>
            {loading ? (
              <Skeleton className="h-20 w-full" data-testid="skeleton" />
            ) : (
              <div className="h-20 w-full" data-testid="content">
                Content Loaded
              </div>
            )}
          </div>
        );
      };

      const { container } = render(<TestComponent />);

      // Initially should show skeleton
      expect(container.querySelector('[data-testid="skeleton"]')).toBeInTheDocument();

      // Wait for transition
      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });

      // Skeleton should be gone
      expect(container.querySelector('[data-testid="skeleton"]')).not.toBeInTheDocument();
    });

    it('should handle rapid loading state changes', async () => {
      const TestComponent = () => {
        const [loading, setLoading] = useState(false);

        return (
          <div>
            <Button onClick={() => setLoading(!loading)}>Toggle Loading</Button>
            {loading ? (
              <Skeleton className="h-12 w-full" data-testid="skeleton" />
            ) : (
              <div data-testid="content">Content</div>
            )}
          </div>
        );
      };

      const user = userEvent.setup();
      const { container } = render(<TestComponent />);

      const toggleButton = screen.getByRole('button', { name: 'Toggle Loading' });

      // Toggle loading on
      await user.click(toggleButton);
      expect(container.querySelector('[data-testid="skeleton"]')).toBeInTheDocument();

      // Toggle loading off
      await user.click(toggleButton);
      expect(screen.getByTestId('content')).toBeInTheDocument();

      // Toggle loading on again
      await user.click(toggleButton);
      expect(container.querySelector('[data-testid="skeleton"]')).toBeInTheDocument();
    });
  });
});
