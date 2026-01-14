
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Budget, Language } from '../types';
import { saveBudget, getBudgets, getCategories } from '../services/expenseService';
import { useTranslation } from '../utils/i18n';

interface BudgetModalProps {
  onClose: () => void;
  onSave: () => void;
  currentLang: Language;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ onClose, onSave, currentLang }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [existingBudgets, setExistingBudgets] = useState<Budget[]>([]);
  const t = useTranslation(currentLang);

  useEffect(() => {
    const cats = getCategories();
    setCategories(cats);
    if (cats.length > 0) setSelectedCategory(cats[0]);

    const budgets = getBudgets();
    setExistingBudgets(budgets);
    const current = budgets.find(b => b.category === cats[0]);
    if (current) setAmount(current.amount);
  }, []);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const saved = existingBudgets.find(b => b.category === cat);
    setAmount(saved ? saved.amount : 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
        saveBudget({ category: selectedCategory, amount });
        onSave();
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('monthlyBudgets')}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('category')}</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 outline-none font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{t(cat)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('totalAmount')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="0"
                step="10"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="w-full pl-8 p-3 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 outline-none font-bold text-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 dark:bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors flex items-center justify-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {t('save')}
          </button>
        </form>
      </div>
    </div>
  );
};
