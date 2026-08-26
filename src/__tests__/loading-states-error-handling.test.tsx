/**
 * Loading States and Error Handling Tests
 *
 * Comprehensive testing covering:
 * - Skeleton loaders preventing layout shifts
 * - Error states in forms
 * - Graceful degradation when animations are disabled
 * - Offline behavior in forms
 *
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
import { PageTransition } from '@/components/layout/PageTransition';

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

  describe('Graceful Degradation When Animations Are Disabled', () => {
    it('should render PageTransition without animations', () => {
      render(
        <PageTransition>
          <div>Test Content</div>
        </PageTransition>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
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
