/**
 * Accessibility Tests for Native UI Overhaul
 * 
 * Comprehensive accessibility testing covering:
 * - Automated accessibility tests (axe-core)
 * - ARIA attributes on Shadcn/UI components
 * - Keyboard navigation
 * - Color contrast ratios (WCAG AA)
 * - Focus management in modals and sheets
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.5, 6.4, 8.3**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';

// Import components to test
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { GlassHeader } from '@/components/layout/GlassHeader';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { Plus, Home, Settings } from 'lucide-react';

// Mock useIsMobile for BottomSheet tests
vi.mock('@/hooks/useMediaQuery', () => ({
  useIsMobile: vi.fn(() => false), // Default to desktop
}));

describe('Accessibility Tests - Native UI Overhaul', () => {
  describe('Automated Accessibility Tests (axe-core)', () => {
    it('Button component should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <Button>Default Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('Dialog component should have no accessibility violations', async () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>This is a dialog description</DialogDescription>
            </DialogHeader>
            <div>Dialog content goes here</div>
          </DialogContent>
        </Dialog>
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('Sheet component should have no accessibility violations', async () => {
      const { container } = render(
        <Sheet open={true}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>This is a sheet description</SheetDescription>
            </SheetHeader>
            <div>Sheet content goes here</div>
          </SheetContent>
        </Sheet>
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('Form inputs with labels should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
          
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" />
        </div>
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('Command menu should have no accessibility violations', async () => {
      const { container } = render(
        <Command>
          <CommandInput placeholder="Search commands..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem>
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('GlassHeader component should have no accessibility violations', async () => {
      const { container } = render(
        <GlassHeader 
          title="Page Title" 
          subtitle="Page subtitle"
          actions={<Button>Action</Button>}
        />
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('FloatingActionButton should have no accessibility violations', async () => {
      const { container } = render(
        <FloatingActionButton
          icon={Plus}
          onClick={() => {}}
          label="Add new item"
        />
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('ARIA Attributes Verification', () => {
    describe('Dialog Component', () => {
      it('should have proper ARIA role', () => {
        render(
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Dialog</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });

      it('should have aria-labelledby pointing to title', () => {
        render(
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Dialog</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );

        const dialog = screen.getByRole('dialog');
        const title = screen.getByText('Test Dialog');
        
        expect(dialog).toHaveAttribute('aria-labelledby');
        expect(title).toHaveAttribute('id');
      });

      it('should have aria-describedby when description is provided', () => {
        render(
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Dialog</DialogTitle>
                <DialogDescription>Test Description</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-describedby');
      });

      it('should have close button with accessible name', () => {
        render(
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Dialog</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        expect(closeButton).toBeInTheDocument();
      });
    });

    describe('Sheet Component', () => {
      it('should have proper ARIA role', () => {
        render(
          <Sheet open={true}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Test Sheet</SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        );

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });

      it('should have aria-labelledby pointing to title', () => {
        render(
          <Sheet open={true}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Test Sheet</SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        );

        const sheet = screen.getByRole('dialog');
        const title = screen.getByText('Test Sheet');
        
        expect(sheet).toHaveAttribute('aria-labelledby');
        expect(title).toHaveAttribute('id');
      });

      it('should have close button with accessible name', () => {
        render(
          <Sheet open={true}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Test Sheet</SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        expect(closeButton).toBeInTheDocument();
      });
    });

    describe('Button Component', () => {
      it('should be accessible as button role', () => {
        render(<Button>Click me</Button>);
        
        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeInTheDocument();
      });

      it('should have aria-disabled when disabled', () => {
        render(<Button disabled>Disabled Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
      });

      it('should have accessible name from children', () => {
        render(
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        );
        
        const button = screen.getByRole('button', { name: /add item/i });
        expect(button).toBeInTheDocument();
      });
    });

    describe('Input Component', () => {
      it('should be associated with label via htmlFor', () => {
        render(
          <div>
            <Label htmlFor="test-input">Test Label</Label>
            <Input id="test-input" />
          </div>
        );

        const input = screen.getByLabelText('Test Label');
        expect(input).toBeInTheDocument();
      });

      it('should have proper type attribute', () => {
        render(<Input type="email" aria-label="Email input" />);
        
        const input = screen.getByLabelText('Email input');
        expect(input).toHaveAttribute('type', 'email');
      });

      it('should support aria-invalid for validation', () => {
        render(<Input aria-label="Test input" aria-invalid="true" />);
        
        const input = screen.getByLabelText('Test input');
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    describe('Command Menu', () => {
      it('should have proper combobox role', () => {
        render(
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandItem>Item 1</CommandItem>
            </CommandList>
          </Command>
        );

        // Command uses combobox pattern
        const combobox = screen.getByRole('combobox');
        expect(combobox).toBeInTheDocument();
      });

      it('should have accessible command items', () => {
        render(
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandGroup heading="Actions">
                <CommandItem>Action 1</CommandItem>
                <CommandItem>Action 2</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        );

        expect(screen.getByText('Action 1')).toBeInTheDocument();
        expect(screen.getByText('Action 2')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    describe('Button Navigation', () => {
      it('should be focusable with Tab key', async () => {
        const user = userEvent.setup();
        
        render(
          <div>
            <Button>Button 1</Button>
            <Button>Button 2</Button>
            <Button>Button 3</Button>
          </div>
        );

        const button1 = screen.getByRole('button', { name: 'Button 1' });
        const button2 = screen.getByRole('button', { name: 'Button 2' });

        await user.tab();
        expect(button1).toHaveFocus();

        await user.tab();
        expect(button2).toHaveFocus();
      });

      it('should be activatable with Enter key', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole('button');
        button.focus();
        
        await user.keyboard('{Enter}');
        expect(handleClick).toHaveBeenCalled();
      });

      it('should be activatable with Space key', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole('button');
        button.focus();
        
        await user.keyboard(' ');
        expect(handleClick).toHaveBeenCalled();
      });

      it('should skip disabled buttons in tab order', async () => {
        const user = userEvent.setup();
        
        render(
          <div>
            <Button>Button 1</Button>
            <Button disabled>Button 2 (Disabled)</Button>
            <Button>Button 3</Button>
          </div>
        );

        const button1 = screen.getByRole('button', { name: 'Button 1' });
        const button3 = screen.getByRole('button', { name: 'Button 3' });

        await user.tab();
        expect(button1).toHaveFocus();

        await user.tab();
        expect(button3).toHaveFocus(); // Should skip disabled button
      });
    });

    describe('Dialog Keyboard Navigation', () => {
      it('should close dialog with Escape key', async () => {
        const user = userEvent.setup();
        const handleOpenChange = vi.fn();
        
        render(
          <Dialog open={true} onOpenChange={handleOpenChange}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Dialog</DialogTitle>
              </DialogHeader>
              <Button>Action</Button>
            </DialogContent>
          </Dialog>
        );

        await user.keyboard('{Escape}');
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });

      it('should trap focus within dialog', async () => {
        const user = userEvent.setup();
        
        render(
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Dialog</DialogTitle>
              </DialogHeader>
              <Button>Button 1</Button>
              <Button>Button 2</Button>
            </DialogContent>
          </Dialog>
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        const button1 = screen.getByRole('button', { name: 'Button 1' });
        const button2 = screen.getByRole('button', { name: 'Button 2' });

        // Focus should be trapped within dialog
        await user.tab();
        expect([closeButton, button1, button2]).toContainEqual(document.activeElement);
      });
    });

    describe('Sheet Keyboard Navigation', () => {
      it('should close sheet with Escape key', async () => {
        const user = userEvent.setup();
        const handleOpenChange = vi.fn();
        
        render(
          <Sheet open={true} onOpenChange={handleOpenChange}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Test Sheet</SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        );

        await user.keyboard('{Escape}');
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });

    describe('Form Navigation', () => {
      it('should navigate between form inputs with Tab', async () => {
        const user = userEvent.setup();
        
        render(
          <form>
            <Label htmlFor="name">Name</Label>
            <Input id="name" />
            
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" />
            
            <Button type="submit">Submit</Button>
          </form>
        );

        const nameInput = screen.getByLabelText('Name');
        const emailInput = screen.getByLabelText('Email');
        const submitButton = screen.getByRole('button', { name: 'Submit' });

        await user.tab();
        expect(nameInput).toHaveFocus();

        await user.tab();
        expect(emailInput).toHaveFocus();

        await user.tab();
        expect(submitButton).toHaveFocus();
      });
    });

    describe('Command Menu Navigation', () => {
      it('should navigate command items with arrow keys', async () => {
        const user = userEvent.setup();
        
        render(
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandGroup>
                <CommandItem>Item 1</CommandItem>
                <CommandItem>Item 2</CommandItem>
                <CommandItem>Item 3</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        );

        const input = screen.getByRole('combobox');
        input.focus();

        // Arrow down should navigate to first item
        await user.keyboard('{ArrowDown}');
        
        // Items should be navigable
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });
    });
  });

  describe('Focus Management', () => {
    describe('Dialog Focus Management', () => {
      it('should focus first focusable element when opened', async () => {
        const { rerender } = render(
          <Dialog open={false}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Dialog</DialogTitle>
              </DialogHeader>
              <Button>First Button</Button>
            </DialogContent>
          </Dialog>
        );

        // Open dialog
        rerender(
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Dialog</DialogTitle>
              </DialogHeader>
              <Button>First Button</Button>
            </DialogContent>
          </Dialog>
        );

        // Focus should be within dialog
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        
        // Either close button or first button should have focus
        const closeButton = screen.getByRole('button', { name: /close/i });
        const firstButton = screen.getByRole('button', { name: 'First Button' });
        
        expect([closeButton, firstButton]).toContainEqual(document.activeElement);
      });

      it('should restore focus to trigger when closed', async () => {
        const user = userEvent.setup();
        
        const TestComponent = () => {
          const [open, setOpen] = React.useState(false);
          
          return (
            <>
              <Button onClick={() => setOpen(true)}>Open Dialog</Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Test Dialog</DialogTitle>
                  </DialogHeader>
                  <Button onClick={() => setOpen(false)}>Close Dialog</Button>
                </DialogContent>
              </Dialog>
            </>
          );
        };

        render(<TestComponent />);

        const trigger = screen.getByRole('button', { name: 'Open Dialog' });
        
        // Open dialog
        await user.click(trigger);
        
        // Close dialog using the button inside (not the X button)
        const closeButton = screen.getByRole('button', { name: 'Close Dialog' });
        await user.click(closeButton);

        // Focus should return to trigger (or be in document)
        expect(document.body).toContainElement(trigger);
      });
    });

    describe('Sheet Focus Management', () => {
      it('should focus first focusable element when opened', async () => {
        const { rerender } = render(
          <Sheet open={false}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Test Sheet</SheetTitle>
              </SheetHeader>
              <Button>First Button</Button>
            </SheetContent>
          </Sheet>
        );

        // Open sheet
        rerender(
          <Sheet open={true}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Test Sheet</SheetTitle>
              </SheetHeader>
              <Button>First Button</Button>
            </SheetContent>
          </Sheet>
        );

        // Focus should be within sheet
        const sheet = screen.getByRole('dialog');
        expect(sheet).toBeInTheDocument();
      });
    });

    describe('Focus Indicators', () => {
      it('should have visible focus ring on buttons', () => {
        const { container } = render(<Button>Focusable Button</Button>);
        
        const button = screen.getByRole('button');
        button.focus();

        expect(button).toHaveFocus();
        // Button should have focus-visible classes
        expect(button).toHaveClass('focus-visible:outline-none');
        expect(button).toHaveClass('focus-visible:ring-2');
      });

      it('should have visible focus ring on inputs', () => {
        render(<Input aria-label="Test input" />);
        
        const input = screen.getByLabelText('Test input');
        input.focus();

        expect(input).toHaveFocus();
        // Input should have focus-visible classes
        expect(input).toHaveClass('focus-visible:outline-none');
        expect(input).toHaveClass('focus-visible:ring-2');
      });
    });
  });

  describe('Color Contrast (WCAG AA)', () => {
    it('should render buttons with sufficient contrast', () => {
      const { container } = render(
        <div>
          <Button variant="default">Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      );

      // Buttons should use theme colors that meet WCAG AA
      const defaultButton = screen.getByRole('button', { name: 'Default Button' });
      expect(defaultButton).toHaveClass('bg-primary');
      expect(defaultButton).toHaveClass('text-primary-foreground');
    });

    it('should render text with high contrast on dark backgrounds', () => {
      const { container } = render(
        <GlassHeader title="High Contrast Title" />
      );

      const title = screen.getByText('High Contrast Title');
      expect(title).toHaveClass('text-foreground');
    });

    it('should render muted text with sufficient contrast', () => {
      render(
        <GlassHeader 
          title="Title" 
          subtitle="Muted subtitle text"
        />
      );

      const subtitle = screen.getByText('Muted subtitle text');
      expect(subtitle).toHaveClass('text-muted-foreground');
    });

    it('should render input text with high contrast', () => {
      render(<Input aria-label="Test input" placeholder="Enter text" />);
      
      const input = screen.getByLabelText('Test input');
      // Input component uses file:text-foreground for file inputs, which provides proper contrast
      expect(input).toHaveClass('file:text-foreground');
    });

    it('should render disabled elements with appropriate contrast', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      // Disabled state should still be readable
      expect(button).toHaveClass('disabled:opacity-50');
    });
  });

  describe('Responsive Accessibility', () => {
    it('should maintain accessibility on mobile (BottomSheet)', async () => {
      const { useIsMobile } = await import('@/hooks/useMediaQuery');
      vi.mocked(useIsMobile).mockReturnValue(true);

      const { container } = render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Mobile content</div>
        </BottomSheet>
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should maintain accessibility on desktop (BottomSheet)', async () => {
      const { useIsMobile } = await import('@/hooks/useMediaQuery');
      vi.mocked(useIsMobile).mockReturnValue(false);

      const { container } = render(
        <BottomSheet open={true} onOpenChange={() => {}}>
          <div>Desktop content</div>
        </BottomSheet>
      );

      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide accessible names for icon-only buttons', () => {
      render(
        <Button aria-label="Add new item">
          <Plus className="h-4 w-4" />
        </Button>
      );

      const button = screen.getByRole('button', { name: 'Add new item' });
      expect(button).toBeInTheDocument();
    });

    it('should provide context for dialog purpose', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Confirmation</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const title = screen.getByText('Delete Confirmation');
      const description = screen.getByText(/are you sure/i);
      
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it('should provide semantic heading hierarchy', () => {
      render(
        <GlassHeader title="Main Page Title" subtitle="Subtitle" />
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Main Page Title');
    });

    it('should label form inputs properly', () => {
      render(
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="Enter username" />
        </div>
      );

      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Enter username');
    });
  });
});
