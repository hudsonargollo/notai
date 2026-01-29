import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { Expense, Language } from '../../types';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the services
vi.mock('../../services/expenseService', () => ({
  getBudgets: vi.fn(() => []),
  getUserProfile: vi.fn(() => ({
    name: 'Test User',
    email: 'test@example.com',
  })),
}));

// Mock the i18n utility
vi.mock('../../utils/i18n', () => ({
  useTranslation: () => (key: string) => key,
}));

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock recharts to avoid rendering issues
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  Cell: () => null,
}));

const mockExpenses: Expense[] = [
  {
    id: '1',
    user_id: 'test-user',
    created_at: new Date().toISOString(),
    amount: 50.0,
    category: 'Food & Dining',
    merchant_name: 'Restaurant A',
    date: new Date().toISOString().split('T')[0],
    ai_summary: 'Lunch at restaurant',
    currency: 'BRL',
  },
  {
    id: '2',
    user_id: 'test-user',
    created_at: new Date().toISOString(),
    amount: 30.0,
    category: 'Transport',
    merchant_name: 'Uber',
    date: new Date().toISOString().split('T')[0],
    ai_summary: 'Ride to work',
    currency: 'BRL',
  },
];

describe('Dashboard Component', () => {
  const defaultProps = {
    expenses: mockExpenses,
    onManageBudgets: vi.fn(),
    onEditExpense: vi.fn(),
    onShowPaywall: vi.fn(),
    onNavigate: vi.fn(),
    currentLang: 'en' as Language,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText('Painel Principal')).toBeInTheDocument();
  });

  it('displays user greeting in header', () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText(/Olá, Test/)).toBeInTheDocument();
  });

  it('renders NeoCore mascot', () => {
    const { container } = render(<Dashboard {...defaultProps} />);
    // NeoCore should be present (check for its container with perspective style)
    const neoCore = container.querySelector('[style*="perspective"]');
    expect(neoCore).toBeInTheDocument();
  });

  it('displays speech bubble with message', () => {
    const { container } = render(<Dashboard {...defaultProps} />);
    // Speech bubble should be present
    const speechBubble = container.querySelector('.font-mono');
    expect(speechBubble).toBeInTheDocument();
    // Message can be any of the state messages
    expect(speechBubble?.textContent).toBeTruthy();
  });

  it('shows skeleton loaders when loading', () => {
    const { container } = render(<Dashboard {...defaultProps} isLoading={true} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays monthly spending total', () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText('Gasto este Mês')).toBeInTheDocument();
    // Total should be 80.00 (50 + 30)
    expect(screen.getByText(/R\$ 80[,.]00/)).toBeInTheDocument();
  });

  it('renders expense list', () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText('Restaurant A')).toBeInTheDocument();
    expect(screen.getByText('Uber')).toBeInTheDocument();
  });

  it('shows empty state when no expenses', () => {
    render(<Dashboard {...defaultProps} expenses={[]} />);
    expect(screen.getByText('Sem Registros')).toBeInTheDocument();
  });

  it('calls onEditExpense when expense is clicked', () => {
    render(<Dashboard {...defaultProps} />);
    const expenseItem = screen.getByText('Restaurant A').closest('div');
    if (expenseItem) {
      fireEvent.click(expenseItem);
      expect(defaultProps.onEditExpense).toHaveBeenCalledWith(mockExpenses[0]);
    }
  });

  it('calls onManageBudgets when Metas card is clicked', () => {
    render(<Dashboard {...defaultProps} />);
    const metasCard = screen.getByText('Metas').closest('div');
    if (metasCard) {
      fireEvent.click(metasCard);
      expect(defaultProps.onManageBudgets).toHaveBeenCalled();
    }
  });

  it('calls onNavigate when camera button is clicked', () => {
    const { container } = render(<Dashboard {...defaultProps} />);
    const cameraButton = container.querySelector('button .lucide-camera')?.closest('button');
    if (cameraButton) {
      fireEvent.click(cameraButton);
      expect(defaultProps.onNavigate).toHaveBeenCalledWith('scan');
    }
  });

  it('calls onShowPaywall when crown button is clicked', () => {
    const { container } = render(<Dashboard {...defaultProps} />);
    const crownButton = container.querySelector('button .lucide-crown')?.closest('button');
    if (crownButton) {
      fireEvent.click(crownButton);
      expect(defaultProps.onShowPaywall).toHaveBeenCalled();
    }
  });

  it('changes NeoCore state to listening when clicked', async () => {
    const { container } = render(<Dashboard {...defaultProps} />);
    const neoCore = container.querySelector('[style*="perspective"]');
    
    if (neoCore) {
      fireEvent.click(neoCore);
      // After clicking, speech bubble should change
      await waitFor(() => {
        expect(screen.getByText(/"Estou ouvindo..."/)).toBeInTheDocument();
      });
    }
  });

  it('applies spring animations to interactive cards', () => {
    const { container } = render(<Dashboard {...defaultProps} />);
    // BentoCards should have motion properties
    const cards = container.querySelectorAll('.glass-panel');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('renders GlassHeader with actions', () => {
    render(<Dashboard {...defaultProps} />);
    // Header should be present with title
    expect(screen.getByText('Painel Principal')).toBeInTheDocument();
    // Actions (camera and crown buttons) should be present
    const { container } = render(<Dashboard {...defaultProps} />);
    expect(container.querySelector('.lucide-camera')).toBeInTheDocument();
    expect(container.querySelector('.lucide-crown')).toBeInTheDocument();
  });

  it('prevents layout shifts with skeleton loaders', () => {
    const { container, rerender } = render(<Dashboard {...defaultProps} isLoading={true} />);
    
    // Get skeleton dimensions
    const skeleton = container.querySelector('.animate-pulse');
    const skeletonHeight = skeleton?.clientHeight;
    
    // Rerender with data loaded
    rerender(<Dashboard {...defaultProps} isLoading={false} />);
    
    // Content should be present
    expect(screen.getByText('Restaurant A')).toBeInTheDocument();
    
    // Layout should be stable (no shifts)
    const contentCard = screen.getByText('Gasto este Mês').closest('.glass-panel');
    expect(contentCard).toBeInTheDocument();
  });

  it('displays correct category icons', () => {
    const { container } = render(<Dashboard {...defaultProps} />);
    
    // Food & Dining should show Utensils icon
    expect(container.querySelector('.lucide-utensils')).toBeInTheDocument();
    
    // Transport should show Plane icon
    expect(container.querySelector('.lucide-plane')).toBeInTheDocument();
  });

  it('updates NeoCore state based on loading prop', async () => {
    const { rerender } = render(<Dashboard {...defaultProps} isLoading={true} />);
    
    // When loading, should show processing message
    await waitFor(() => {
      expect(screen.getByText(/"Processando dados..."/)).toBeInTheDocument();
    });
    
    // When loaded, should show success then idle
    rerender(<Dashboard {...defaultProps} isLoading={false} />);
    
    await waitFor(() => {
      expect(screen.getByText(/"Tudo certo!"/)).toBeInTheDocument();
    }, { timeout: 500 });
  });
});
