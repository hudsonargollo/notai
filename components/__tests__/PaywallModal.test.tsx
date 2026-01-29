import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaywallModal } from '../PaywallModal';
import { Language } from '../../types';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('PaywallModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubscribe = vi.fn();
  const mockOnStartTrial = vi.fn();
  const currentLang: Language = 'en';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal with premium content', () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
      />
    );

    // Check for premium title (using translation key pattern)
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays special offer badge when specialOffer is true', () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
        specialOffer={true}
      />
    );

    expect(screen.getByText(/Limited Time/i)).toBeInTheDocument();
  });

  it('does not display special offer badge when specialOffer is false', () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
        specialOffer={false}
      />
    );

    expect(screen.queryByText(/Limited Time/i)).not.toBeInTheDocument();
  });

  it('displays trial button when specialOffer is true and onStartTrial is provided', () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
        specialOffer={true}
        onStartTrial={mockOnStartTrial}
      />
    );

    // Look for button with trial text (translation key)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(2); // Subscribe, Trial, Restore
  });

  it('does not display trial button when specialOffer is false', () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
        specialOffer={false}
        onStartTrial={mockOnStartTrial}
      />
    );

    const buttons = screen.getAllByRole('button');
    // Should have Subscribe, Restore, and Close (X) buttons
    expect(buttons.length).toBe(3);
  });

  it('calls onSubscribe when subscribe button is clicked', async () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
      />
    );

    // Find subscribe button by icon or aria-label
    const subscribeButton = screen.getAllByRole('button')[0]; // First button should be subscribe
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(mockOnSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onStartTrial when trial button is clicked', async () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
        specialOffer={true}
        onStartTrial={mockOnStartTrial}
      />
    );

    const buttons = screen.getAllByRole('button');
    const trialButton = buttons[1]; // Second button should be trial
    fireEvent.click(trialButton);

    await waitFor(() => {
      expect(mockOnStartTrial).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onClose when restore button is clicked', async () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
      />
    );

    const buttons = screen.getAllByRole('button');
    const restoreButton = buttons[buttons.length - 1]; // Last button should be restore
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    }, { timeout: 300 });
  });

  it('displays all three benefits', () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
      />
    );

    // Check for benefit container with space-y-4 class
    const benefitContainer = screen.getByRole('dialog').querySelector('.space-y-4');
    expect(benefitContainer).toBeInTheDocument();
    
    // Check that there are 3 benefit items (divs with flex items-center)
    const benefitItems = benefitContainer?.querySelectorAll('.flex.items-center');
    expect(benefitItems?.length).toBe(3);
  });

  it('has proper accessibility attributes', () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
      />
    );

    // Check for dialog role
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Check for aria-describedby
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-describedby');
  });

  it('displays premium avatar image', () => {
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
      />
    );

    const avatar = screen.getByAltText('Neo Premium');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src');
  });

  it('closes modal after delay when onClose is triggered', async () => {
    vi.useFakeTimers();
    
    render(
      <PaywallModal
        onClose={mockOnClose}
        onSubscribe={mockOnSubscribe}
        currentLang={currentLang}
      />
    );

    const buttons = screen.getAllByRole('button');
    const restoreButton = buttons[buttons.length - 2]; // Second to last (before close X)
    fireEvent.click(restoreButton);

    // Fast-forward time
    await vi.advanceTimersByTimeAsync(200);

    expect(mockOnClose).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
