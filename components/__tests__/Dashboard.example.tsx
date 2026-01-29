/**
 * Dashboard Component Example
 * 
 * This file demonstrates the migrated Dashboard component with all new features:
 * - PageTransition wrapper for smooth navigation
 * - GlassHeader with glassmorphism effects
 * - NeoCore animated mascot with state management
 * - Speech bubble component with animations
 * - Skeleton loaders for loading states
 * - Spring animations on interactive elements
 * - No layout shifts during data loading
 */

import React, { useState } from 'react';
import { Dashboard } from '../Dashboard';
import { Expense, Language } from '../../types';

// Sample expense data
const sampleExpenses: Expense[] = [
  {
    id: '1',
    user_id: 'demo-user',
    created_at: new Date().toISOString(),
    amount: 125.50,
    category: 'Food & Dining',
    merchant_name: 'Restaurante Italiano',
    date: new Date().toISOString().split('T')[0],
    ai_summary: 'Jantar no restaurante italiano',
    currency: 'BRL',
  },
  {
    id: '2',
    user_id: 'demo-user',
    created_at: new Date().toISOString(),
    amount: 45.00,
    category: 'Transport',
    merchant_name: 'Uber',
    date: new Date().toISOString().split('T')[0],
    ai_summary: 'Corrida para o trabalho',
    currency: 'BRL',
  },
  {
    id: '3',
    user_id: 'demo-user',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    amount: 89.99,
    category: 'Bills & Utilities',
    merchant_name: 'Netflix',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    ai_summary: 'Assinatura mensal Netflix',
    currency: 'BRL',
  },
  {
    id: '4',
    user_id: 'demo-user',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    amount: 32.50,
    category: 'Food & Dining',
    merchant_name: 'Café Central',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    ai_summary: 'Café da manhã',
    currency: 'BRL',
  },
  {
    id: '5',
    user_id: 'demo-user',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    amount: 250.00,
    category: 'Transport',
    merchant_name: 'Posto Shell',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    ai_summary: 'Abastecimento de gasolina',
    currency: 'BRL',
  },
];

/**
 * Basic Dashboard Example
 * 
 * Shows the Dashboard with sample data and all features enabled.
 */
export function BasicDashboardExample() {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);

  return (
    <div style={{ height: '100vh', background: '#0a0a0a' }}>
      <Dashboard
        expenses={expenses}
        onManageBudgets={() => console.log('Manage budgets clicked')}
        onEditExpense={(expense) => console.log('Edit expense:', expense)}
        onShowPaywall={() => console.log('Show paywall clicked')}
        onNavigate={(view) => console.log('Navigate to:', view)}
        currentLang="pt" as Language
      />
    </div>
  );
}

/**
 * Loading State Example
 * 
 * Demonstrates the Dashboard with skeleton loaders during data loading.
 * Shows how layout remains stable without shifts.
 */
export function LoadingDashboardExample() {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Simulate data loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setExpenses(sampleExpenses);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: '100vh', background: '#0a0a0a' }}>
      <Dashboard
        expenses={expenses}
        onManageBudgets={() => console.log('Manage budgets clicked')}
        onEditExpense={(expense) => console.log('Edit expense:', expense)}
        onShowPaywall={() => console.log('Show paywall clicked')}
        onNavigate={(view) => console.log('Navigate to:', view)}
        currentLang="pt" as Language
        isLoading={isLoading}
      />
    </div>
  );
}

/**
 * Empty State Example
 * 
 * Shows the Dashboard when there are no expenses.
 * NeoCore mascot remains visible with appropriate messaging.
 */
export function EmptyDashboardExample() {
  return (
    <div style={{ height: '100vh', background: '#0a0a0a' }}>
      <Dashboard
        expenses={[]}
        onManageBudgets={() => console.log('Manage budgets clicked')}
        onEditExpense={(expense) => console.log('Edit expense:', expense)}
        onShowPaywall={() => console.log('Show paywall clicked')}
        onNavigate={(view) => console.log('Navigate to:', view)}
        currentLang="pt" as Language
      />
    </div>
  );
}

/**
 * Interactive NeoCore Example
 * 
 * Demonstrates the NeoCore mascot's interactive state changes.
 * Click the mascot to see it transition through different states.
 */
export function InteractiveNeoCoreExample() {
  return (
    <div style={{ height: '100vh', background: '#0a0a0a' }}>
      <Dashboard
        expenses={sampleExpenses}
        onManageBudgets={() => console.log('Manage budgets clicked')}
        onEditExpense={(expense) => console.log('Edit expense:', expense)}
        onShowPaywall={() => console.log('Show paywall clicked')}
        onNavigate={(view) => console.log('Navigate to:', view)}
        currentLang="pt" as Language
      />
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '10px',
        color: 'white',
        fontSize: '12px',
        maxWidth: '300px',
      }}>
        <strong>💡 Tip:</strong> Click the NeoCore cube to see it change to listening state!
        <br /><br />
        <strong>States:</strong>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Idle: Slow rotation with floating</li>
          <li>Listening: Breathing animation</li>
          <li>Processing: Rapid rotation (when loading)</li>
          <li>Success: Isometric view (after loading)</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * All Features Showcase
 * 
 * Comprehensive example showing all Dashboard features:
 * - PageTransition animations
 * - GlassHeader with actions
 * - NeoCore mascot with state management
 * - Speech bubble animations
 * - Skeleton loaders
 * - Spring animations on cards
 * - Interactive expense list
 */
export function CompleteDashboardShowcase() {
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setExpenses([...sampleExpenses]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div style={{ height: '100vh', background: '#0a0a0a' }}>
      <Dashboard
        expenses={expenses}
        onManageBudgets={() => alert('Opening budget management...')}
        onEditExpense={(expense) => alert(`Editing: ${expense.merchant_name}`)}
        onShowPaywall={() => alert('Opening paywall...')}
        onNavigate={(view) => alert(`Navigating to: ${view}`)}
        currentLang="pt" as Language
        isLoading={isLoading}
      />
      
      {/* Control Panel */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.9)',
        padding: '20px',
        borderRadius: '15px',
        color: 'white',
        fontSize: '14px',
        minWidth: '250px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>🎮 Controls</h3>
        
        <button
          onClick={handleRefresh}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(204, 255, 0, 0.1)',
            border: '1px solid rgba(204, 255, 0, 0.3)',
            borderRadius: '8px',
            color: '#CCFF00',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          🔄 Simulate Loading
        </button>
        
        <button
          onClick={() => setExpenses([])}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          🗑️ Clear Expenses
        </button>
        
        <button
          onClick={() => setExpenses(sampleExpenses)}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          ➕ Restore Expenses
        </button>
        
        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
        }}>
          <strong>Features:</strong>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>✅ PageTransition wrapper</li>
            <li>✅ GlassHeader navigation</li>
            <li>✅ NeoCore mascot</li>
            <li>✅ Speech bubble</li>
            <li>✅ Skeleton loaders</li>
            <li>✅ Spring animations</li>
            <li>✅ No layout shifts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Export all examples
export default {
  BasicDashboardExample,
  LoadingDashboardExample,
  EmptyDashboardExample,
  InteractiveNeoCoreExample,
  CompleteDashboardShowcase,
};
