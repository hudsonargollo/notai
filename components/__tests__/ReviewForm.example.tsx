/**
 * ReviewForm Component Examples
 * 
 * Demonstrates usage of the migrated ReviewForm component with Shadcn/UI primitives.
 * Shows both new expense (from AI receipt) and edit expense scenarios.
 */

import React, { useState } from 'react';
import { ReviewForm } from '../ReviewForm';
import { AIReceiptResponse, Expense } from '../../types';

/**
 * Example 1: New Expense from AI Receipt
 * 
 * Shows how to use ReviewForm with data from AI receipt scanning.
 * The form is pre-populated with extracted data that the user can review and edit.
 */
export function NewExpenseExample() {
  const [isOpen, setIsOpen] = useState(true);

  const aiReceiptData: AIReceiptResponse = {
    merchant_name: 'Whole Foods Market',
    transaction_date: '2024-01-15',
    total_amount: 127.50,
    currency: 'BRL',
    category: 'Food & Dining',
    line_items: [
      { item: 'Organic Vegetables', price: 45.00, quantity: 1 },
      { item: 'Fresh Fruits', price: 32.50, quantity: 1 },
      { item: 'Dairy Products', price: 28.00, quantity: 1 },
      { item: 'Bakery Items', price: 22.00, quantity: 1 },
    ],
    summary_note: 'Weekly grocery shopping at Whole Foods',
  };

  const handleSave = () => {
    console.log('Expense saved!');
    setIsOpen(false);
  };

  const handleCancel = () => {
    console.log('Review cancelled');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Open New Expense Form
        </button>
      </div>
    );
  }

  return (
    <ReviewForm
      initialData={aiReceiptData}
      imageUrl="https://example.com/receipt-image.jpg"
      onSave={handleSave}
      onCancel={handleCancel}
      currentLang="en"
    />
  );
}

/**
 * Example 2: Edit Existing Expense
 * 
 * Shows how to use ReviewForm to edit an existing expense.
 * The form displays "Editar" (Edit) instead of "Revisar" (Review).
 */
export function EditExpenseExample() {
  const [isOpen, setIsOpen] = useState(true);

  const existingExpense: Expense = {
    id: 'exp-123',
    user_id: 'user-456',
    created_at: '2024-01-10T10:00:00Z',
    merchant_name: 'Amazon',
    amount: 89.99,
    category: 'Shopping',
    date: '2024-01-10',
    receipt_image_url: 'https://example.com/amazon-receipt.jpg',
    ai_summary: 'Electronics purchase from Amazon',
    currency: 'BRL',
    line_items: [
      { item: 'USB-C Cable', price: 29.99, quantity: 2 },
      { item: 'Phone Case', price: 30.01, quantity: 1 },
    ],
    is_recurring: false,
  };

  const handleSave = () => {
    console.log('Expense updated!');
    setIsOpen(false);
  };

  const handleCancel = () => {
    console.log('Edit cancelled');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Open Edit Expense Form
        </button>
      </div>
    );
  }

  return (
    <ReviewForm
      initialData={existingExpense}
      onSave={handleSave}
      onCancel={handleCancel}
      currentLang="en"
    />
  );
}

/**
 * Example 3: Minimal Receipt Data
 * 
 * Shows how the form handles minimal data from AI receipt scanning.
 * Demonstrates default values and category selection.
 */
export function MinimalReceiptExample() {
  const [isOpen, setIsOpen] = useState(true);

  const minimalReceipt: AIReceiptResponse = {
    merchant_name: 'Local Coffee Shop',
    transaction_date: '2024-01-16',
    total_amount: 12.50,
    currency: 'BRL',
    category: 'Food & Dining',
    line_items: [],
    summary_note: '',
  };

  const handleSave = () => {
    console.log('Minimal expense saved!');
    setIsOpen(false);
  };

  const handleCancel = () => {
    console.log('Review cancelled');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Open Minimal Receipt Form
        </button>
      </div>
    );
  }

  return (
    <ReviewForm
      initialData={minimalReceipt}
      onSave={handleSave}
      onCancel={handleCancel}
      currentLang="en"
    />
  );
}

/**
 * Example 4: Portuguese Language
 * 
 * Shows the form with Portuguese language support.
 */
export function PortugueseLanguageExample() {
  const [isOpen, setIsOpen] = useState(true);

  const receiptData: AIReceiptResponse = {
    merchant_name: 'Supermercado Extra',
    transaction_date: '2024-01-15',
    total_amount: 250.00,
    currency: 'BRL',
    category: 'Food & Dining',
    line_items: [
      { item: 'Arroz', price: 25.00, quantity: 2 },
      { item: 'Feijão', price: 15.00, quantity: 3 },
      { item: 'Carne', price: 85.00, quantity: 1 },
      { item: 'Frutas', price: 35.00, quantity: 1 },
    ],
    summary_note: 'Compras do mês',
  };

  const handleSave = () => {
    console.log('Despesa salva!');
    setIsOpen(false);
  };

  const handleCancel = () => {
    console.log('Revisão cancelada');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Abrir Formulário em Português
        </button>
      </div>
    );
  }

  return (
    <ReviewForm
      initialData={receiptData}
      onSave={handleSave}
      onCancel={handleCancel}
      currentLang="pt"
    />
  );
}

/**
 * Example 5: All Examples Combined
 * 
 * Demonstrates all examples in a single view for easy comparison.
 */
export function AllExamples() {
  const [activeExample, setActiveExample] = useState<string | null>(null);

  const examples = [
    { id: 'new', label: 'New Expense from AI Receipt', component: NewExpenseExample },
    { id: 'edit', label: 'Edit Existing Expense', component: EditExpenseExample },
    { id: 'minimal', label: 'Minimal Receipt Data', component: MinimalReceiptExample },
    { id: 'portuguese', label: 'Portuguese Language', component: PortugueseLanguageExample },
  ];

  if (activeExample) {
    const Example = examples.find(e => e.id === activeExample)?.component;
    return Example ? <Example /> : null;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          ReviewForm Component Examples
        </h1>
        <p className="text-slate-400 mb-8">
          Migrated to use Shadcn/UI components with form validation, Lucide icons, and Framer Motion animations.
        </p>

        <div className="grid gap-4">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-colors"
            >
              <h2 className="text-xl font-bold text-white mb-2">
                {example.label}
              </h2>
              <p className="text-slate-400 text-sm">
                Click to view this example
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">
            Key Features
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Shadcn/UI Form components with react-hook-form validation</li>
            <li>✓ Inline validation feedback with error messages</li>
            <li>✓ Shadcn/UI Input components for all form fields</li>
            <li>✓ Shadcn/UI Button components with variants</li>
            <li>✓ Lucide icons (ArrowLeft, Save, Edit2)</li>
            <li>✓ Framer Motion animations on submit button</li>
            <li>✓ Editable amount with click-to-edit functionality</li>
            <li>✓ Category selection with visual feedback</li>
            <li>✓ Support for both new and existing expenses</li>
            <li>✓ Multi-language support (English and Portuguese)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AllExamples;
