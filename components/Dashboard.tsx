import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Asterisk, Receipt, ArrowDownRight, Minus, Plus } from 'lucide-react';
import { Expense, Budget, Language, UserProfile } from '../types';
import { getBudgets, getCategories, saveBudget } from '../services/expenseService';
import { useTranslation } from '../utils/i18n';

interface DashboardProps {
  expenses: Expense[];
  user: UserProfile | null;
  onEditExpense: (expense: Expense) => void;
  onOpenSettings: () => void;
  onOpenInsights: () => void;
  currentLang: Language;
  highlightedExpenseId?: string | null;
}

const format = (str: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), str);

const formatNumber = (n: number, currentLang: Language) =>
  n.toLocaleString(currentLang === 'pt' ? 'pt-BR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatAmount = (n: number, currentLang: Language) => `R$ ${formatNumber(n, currentLang)}`;

const AnimatedAmount: React.FC<{ value: number; currentLang: Language }> = ({ value, currentLang }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    let start: number | null = null;
    let raf = 0;
    const duration = 400;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setDisplay(value * progress);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className="tabular-nums">{formatAmount(display, currentLang)}</span>;
};

interface BudgetRowProps {
  label: string;
  spent: number;
  limit: number;
  editing: boolean;
  onAdjust: (delta: number) => void;
  onSet: (amount: number) => void;
  currentLang: Language;
  t: (key: string) => string;
}

const BudgetRow: React.FC<BudgetRowProps> = ({ label, spent, limit, editing, onAdjust, onSet, currentLang, t }) => {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const over = limit > 0 && spent > limit;
  const holdRef = useRef<{ timeout?: ReturnType<typeof setTimeout>; interval?: ReturnType<typeof setInterval> }>({});

  const stopHold = () => {
    if (holdRef.current.timeout) clearTimeout(holdRef.current.timeout);
    if (holdRef.current.interval) clearInterval(holdRef.current.interval);
    holdRef.current = {};
  };

  const startHold = (delta: number) => {
    onAdjust(delta);
    let ticks = 0;
    holdRef.current.timeout = setTimeout(() => {
      holdRef.current.interval = setInterval(() => {
        onAdjust(delta);
        ticks += 1;
        if (ticks === 8 && holdRef.current.interval) {
          clearInterval(holdRef.current.interval);
          holdRef.current.interval = setInterval(() => onAdjust(delta), 45);
        }
      }, 130);
    }, 450);
  };

  useEffect(() => () => stopHold(), []);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span className="text-[15px] font-semibold text-text">{label}</span>
        {editing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="-"
              onMouseDown={() => startHold(-50)}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() => startHold(-50)}
              onTouchEnd={stopHold}
              className="w-11 h-11 rounded-full bg-surface-2 flex items-center justify-center text-text active:scale-95 transition-transform"
            >
              <Minus className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <input
              type="number"
              value={limit}
              onChange={(e) => onSet(Math.max(0, Number(e.target.value) || 0))}
              className="w-20 text-center text-[15px] font-bold tabular-nums bg-surface-2 rounded-input py-2 outline-none focus:ring-2 focus:ring-accent"
              aria-label={label}
            />
            <button
              type="button"
              aria-label="+"
              onMouseDown={() => startHold(50)}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() => startHold(50)}
              onTouchEnd={stopHold}
              className="w-11 h-11 rounded-full bg-surface-2 flex items-center justify-center text-text active:scale-95 transition-transform"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <span className={`text-[13px] tabular-nums ${over ? 'text-danger' : 'text-muted'}`}>
            {formatAmount(spent, currentLang)} / {formatAmount(limit, currentLang)}
          </span>
        )}
      </div>
      <div className="h-1.5 rounded-pill bg-surface-2 overflow-hidden">
        <div
          className={`h-full rounded-pill ${over ? 'bg-danger' : 'bg-accent2'}`}
          style={{ width: `${limit > 0 ? pct : 0}%` }}
        />
      </div>
      {over && (
        <p className="text-[11px] text-danger mt-1">{format(t('homeBudgetsOverBy'), { amount: (spent - limit).toFixed(2) })}</p>
      )}
    </div>
  );
};

const TransactionRow: React.FC<{
  expense: Expense;
  onEdit: (e: Expense) => void;
  currentLang: Language;
  t: (k: string) => string;
  highlighted?: boolean;
}> = ({ expense, onEdit, currentLang, t, highlighted }) => {
  const dateStr = new Date(`${expense.date}T00:00:00`).toLocaleDateString(currentLang === 'pt' ? 'pt-BR' : 'en-US', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <button
      type="button"
      onClick={() => onEdit(expense)}
      className={`w-full flex items-center justify-between gap-3 py-3 px-2 -mx-2 rounded-card border-b border-border last:border-b-0 text-left min-h-[56px] transition-colors duration-500 ${
        highlighted ? 'bg-accent-soft' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center flex-shrink-0">
          <Receipt className="h-4 w-4 text-muted" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-text truncate">{expense.merchant_name}</p>
          <p className="text-[13px] text-muted truncate">{t(expense.category)}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[15px] font-bold text-text tabular-nums">{formatAmount(expense.amount, currentLang)}</p>
        <p className="text-[11px] text-muted">{dateStr}</p>
      </div>
    </button>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({
  expenses,
  user,
  onEditExpense,
  onOpenSettings,
  onOpenInsights,
  currentLang,
  highlightedExpenseId,
}) => {
  const t = useTranslation(currentLang);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingBudgets, setEditingBudgets] = useState(false);
  const [showAllBudgets, setShowAllBudgets] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
    setBudgets(getBudgets());
  }, []);

  const now = useMemo(() => new Date(), []);
  const locale = currentLang === 'pt' ? 'pt-BR' : 'en-US';
  const rawMonthLabel = now.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const monthLabel = rawMonthLabel.charAt(0).toUpperCase() + rawMonthLabel.slice(1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();

  const stats = useMemo(() => {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];

    let totalMonthlySpent = 0;
    let totalLastMonthSpent = 0;
    const spentByCategory: Record<string, number> = {};

    expenses.forEach((e) => {
      if (e.date >= startOfMonth) {
        totalMonthlySpent += e.amount;
        spentByCategory[e.category] = (spentByCategory[e.category] || 0) + e.amount;
      } else if (e.date >= startOfLastMonth && e.date < startOfMonth) {
        totalLastMonthSpent += e.amount;
      }
    });

    return { totalMonthlySpent, totalLastMonthSpent, spentByCategory };
  }, [expenses, now]);

  const insight = useMemo(() => {
    if (stats.totalLastMonthSpent <= 0) return null;
    const diffPct = Math.round(((stats.totalMonthlySpent - stats.totalLastMonthSpent) / stats.totalLastMonthSpent) * 100);
    if (diffPct === 0) return null;
    const key = diffPct > 0 ? 'insightMonthAboveLast' : 'insightMonthBelowLast';
    return format(t(key), { pct: Math.abs(diffPct) });
  }, [stats, t]);

  const budgetRows = useMemo(() => {
    const rows = categories.map((category) => {
      const budget = budgets.find((b) => b.category === category);
      return { category, limit: budget?.amount ?? 0, spent: stats.spentByCategory[category] ?? 0 };
    });
    const withActivity = rows.filter((r) => r.limit > 0 || r.spent > 0).sort((a, b) => b.spent - a.spent);
    return withActivity.length > 0 ? withActivity : rows;
  }, [categories, budgets, stats]);

  const visibleBudgetRows = showAllBudgets ? budgetRows : budgetRows.slice(0, 3);

  const handleAdjustBudget = (category: string, delta: number) => {
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.category === category);
      const current = idx !== -1 ? prev[idx].amount : 0;
      const next = Math.max(0, current + delta);
      saveBudget({ category, amount: next });
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { category, amount: next };
        return copy;
      }
      return [...prev, { category, amount: next }];
    });
  };

  const handleSetBudget = (category: string, amount: number) => {
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.category === category);
      saveBudget({ category, amount });
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { category, amount };
        return copy;
      }
      return [...prev, { category, amount }];
    });
  };

  const sortedExpenses = expenses;
  const visibleExpenses = showAllRecent ? sortedExpenses : sortedExpenses.slice(0, 6);
  const firstName = user?.name?.split(' ')[0] || '';
  const monthlyTarget = user?.monthlyBudget ?? 0;
  const heroPct = monthlyTarget > 0 ? Math.min((stats.totalMonthlySpent / monthlyTarget) * 100, 100) : 0;
  const heroOver = monthlyTarget > 0 && stats.totalMonthlySpent > monthlyTarget;

  return (
    <div className="h-full w-full overflow-y-auto no-scrollbar bg-bg">
      <div className="px-5 pt-6 pb-3 flex items-start justify-between">
        <div>
          <h1 className="font-display text-[28px] leading-tight text-text">{format(t('homeGreeting'), { name: firstName })}</h1>
          <p className="text-[13px] text-muted mt-0.5">{monthLabel}</p>
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label={t('navSettings')}
          className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text font-bold flex-shrink-0"
        >
          {firstName ? firstName[0].toUpperCase() : 'U'}
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="px-5 pt-16 flex flex-col items-center text-center">
          <h2 className="font-display text-[22px] text-text mb-2">{t('emptyTransactionsTitle')}</h2>
          <p className="text-[15px] text-muted mb-6">{t('emptyTransactions')}</p>
          <ArrowDownRight className="h-6 w-6 text-muted" strokeWidth={2} />
        </div>
      ) : (
        <div className="px-5 pb-32 flex flex-col gap-5">
          <div className="bg-surface rounded-card p-5">
            <p className="text-[13px] text-muted mb-1">{format(t('homeHeroLabel'), { month: monthLabel })}</p>
            <div className="font-display text-[40px] leading-none text-text mb-3">
              <AnimatedAmount value={stats.totalMonthlySpent} currentLang={currentLang} />
            </div>
            <div className="h-1.5 rounded-pill bg-surface-2 overflow-hidden mb-2">
              <div className={`h-full rounded-pill ${heroOver ? 'bg-danger' : 'bg-accent2'}`} style={{ width: `${heroPct}%` }} />
            </div>
            <p className="text-[13px] text-muted">
              {format(t('homeHeroSub'), { target: formatNumber(monthlyTarget, currentLang) })} · {daysLeft} {currentLang === 'pt' ? 'dias' : 'days'}
            </p>
          </div>

          {insight && (
            <button
              type="button"
              onClick={onOpenInsights}
              className="text-left bg-accent2-soft rounded-card p-5 flex gap-3"
            >
              <Asterisk className="h-[18px] w-[18px] text-accent2-deep flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <p className="text-[15px] text-text">{insight}</p>
                <p className="text-[11px] text-accent2-deep mt-2">Insight · {t('insightsFooter')}</p>
              </div>
            </button>
          )}

          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-[15px] font-bold text-text">{t('homeBudgetsTitle')}</h3>
              <button
                type="button"
                onClick={() => setEditingBudgets((v) => !v)}
                className="text-[13px] font-bold text-accent-deep min-h-[44px] px-2"
              >
                {editingBudgets ? t('homeBudgetsDone') : t('homeBudgetsEdit')}
              </button>
            </div>
            {editingBudgets && <p className="text-[11px] text-muted mb-2 px-1">{t('homeBudgetsHint')}</p>}
            <div className="bg-surface rounded-card px-5 divide-y divide-border">
              {visibleBudgetRows.map((row) => (
                <BudgetRow
                  key={row.category}
                  label={t(row.category)}
                  spent={row.spent}
                  limit={row.limit}
                  editing={editingBudgets}
                  onAdjust={(delta) => handleAdjustBudget(row.category, delta)}
                  onSet={(amount) => handleSetBudget(row.category, amount)}
                  currentLang={currentLang}
                  t={t}
                />
              ))}
            </div>
            {budgetRows.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllBudgets((v) => !v)}
                className="text-[13px] font-bold text-accent-deep mt-2 px-1 min-h-[44px]"
              >
                {showAllBudgets ? t('homeBudgetsEdit') : t('homeBudgetsSeeAll')}
              </button>
            )}
          </div>

          <div>
            <h3 className="text-[15px] font-bold text-text mb-2 px-1">{t('homeRecentTitle')}</h3>
            <div className="bg-surface rounded-card px-5">
              {visibleExpenses.map((expense) => (
                <TransactionRow
                  key={expense.id}
                  expense={expense}
                  onEdit={onEditExpense}
                  currentLang={currentLang}
                  t={t}
                  highlighted={expense.id === highlightedExpenseId}
                />
              ))}
            </div>
            {sortedExpenses.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAllRecent((v) => !v)}
                className="text-[13px] font-bold text-accent-deep mt-2 px-1 min-h-[44px]"
              >
                {showAllRecent ? t('homeBudgetsEdit') : t('homeRecentSeeAll')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
