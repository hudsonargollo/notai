import React, { useEffect, useMemo, useState } from 'react';
import { Asterisk, Lock } from 'lucide-react';
import { useTranslation } from '../utils/i18n';
import { Language, Expense, Budget, UserProfile } from '../types';
import { getExpenses, getBudgets, getUserProfile, updateExpense } from '../services/expenseService';

interface InsightsProps {
  currentLang: Language;
  onNavigateHome: () => void;
  onShowPaywall: () => void;
}

const format = (str: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), str);

const formatNumber = (n: number, currentLang: Language) =>
  n.toLocaleString(currentLang === 'pt' ? 'pt-BR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface InsightCard {
  id: string;
  body: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

const CardShell: React.FC<{ card: InsightCard; footer: string }> = ({ card, footer }) => (
  <div className="bg-accent2-soft rounded-card p-5 flex gap-3">
    <Asterisk className="h-[18px] w-[18px] text-accent2-deep flex-shrink-0 mt-0.5" strokeWidth={2.5} />
    <div className="flex-1 min-w-0">
      <div className="text-[15px] text-text leading-relaxed">{card.body}</div>
      {card.action && (
        <button
          onClick={card.action.onClick}
          className="mt-3 text-[13px] font-bold text-accent-deep min-h-[44px] -ml-1 px-1"
        >
          {card.action.label}
        </button>
      )}
      <p className="text-[11px] text-accent2-deep mt-2">Insight · {footer}</p>
    </div>
  </div>
);

export const Insights: React.FC<InsightsProps> = ({ currentLang, onNavigateHome, onShowPaywall }) => {
  const t = useTranslation(currentLang);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setExpenses(getExpenses());
    setBudgets(getBudgets());
    setUser(getUserProfile());
  }, []);

  const now = useMemo(() => new Date(), []);
  const locale = currentLang === 'pt' ? 'pt-BR' : 'en-US';
  const rawMonthLabel = now.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const monthLabel = rawMonthLabel.charAt(0).toUpperCase() + rawMonthLabel.slice(1);

  const markRecurring = (expense: Expense) => {
    updateExpense({ ...expense, is_recurring: true });
    setExpenses(getExpenses());
  };

  const cards = useMemo(() => {
    const result: InsightCard[] = [];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const monthlyExpenses = expenses.filter((e) => e.date >= startOfMonth);
    const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    // 1. Resumo do mês
    if (user?.monthlyBudget) {
      result.push({
        id: 'summary',
        body: format(t('insightsMonthSummary'), {
          spent: formatNumber(totalSpent, currentLang),
          target: formatNumber(user.monthlyBudget, currentLang),
        }),
      });
    }

    // 2. Tendência por categoria — top category by spend, with 4 weekly bars
    const byCategory: Record<string, number> = {};
    monthlyExpenses.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });
    const topCategoryEntry = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0];
    if (topCategoryEntry) {
      const [topCategory, topAmount] = topCategoryEntry;
      const weeklyTotals = [0, 0, 0, 0];
      monthlyExpenses
        .filter((e) => e.category === topCategory)
        .forEach((e) => {
          const day = new Date(e.date).getDate();
          const week = Math.min(3, Math.floor((day - 1) / 7));
          weeklyTotals[week] += e.amount;
        });
      const maxWeek = Math.max(...weeklyTotals, 1);
      result.push({
        id: 'trend',
        body: (
          <>
            <p>{format(t('insightsTopCategory'), { category: topCategory, amount: formatNumber(topAmount, currentLang) })}</p>
            <div className="flex items-end gap-1.5 mt-3 h-10">
              {weeklyTotals.map((w, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-thumb ${i === 3 ? 'bg-accent' : 'bg-surface-2'}`}
                  style={{ height: `${Math.max(8, (w / maxWeek) * 100)}%` }}
                />
              ))}
            </div>
          </>
        ),
        action: { label: t('insightsMonthSummaryAction'), onClick: onNavigateHome },
      });
    }

    // 3. Recorrentes detectadas
    const candidates = new Map<string, Expense[]>();
    expenses
      .filter((e) => !e.is_recurring)
      .forEach((e) => {
        const key = e.merchant_name.trim().toLowerCase();
        if (!candidates.has(key)) candidates.set(key, []);
        candidates.get(key)!.push(e);
      });
    for (const group of candidates.values()) {
      if (group.length < 2) continue;
      const sorted = [...group].sort((a, b) => a.date.localeCompare(b.date));
      const [a, b] = sorted.slice(-2);
      const dayA = new Date(a.date).getDate();
      const dayB = new Date(b.date).getDate();
      const monthA = a.date.slice(0, 7);
      const monthB = b.date.slice(0, 7);
      const sameDayOfMonth = Math.abs(dayA - dayB) <= 2;
      const similarAmount = Math.abs(a.amount - b.amount) <= a.amount * 0.1;
      if (sameDayOfMonth && similarAmount && monthA !== monthB) {
        result.push({
          id: `recurring-${b.id}`,
          body: format(t('insightsRecurringDetected'), {
            merchant: b.merchant_name,
            day: dayB,
            amount: formatNumber(b.amount, currentLang),
          }),
          action: { label: t('insightsRecurringAction'), onClick: () => markRecurring(b) },
        });
        break;
      }
    }

    // 4. Alerta de limite — only when >85% of a budget used
    for (const budget of budgets) {
      if (budget.amount <= 0) continue;
      const spent = byCategory[budget.category] || 0;
      const pct = Math.round((spent / budget.amount) * 100);
      if (pct > 85) {
        result.push({
          id: `limit-${budget.category}`,
          body: (
            <p>
              {format(t('insightsLimitAlertLead'), { category: budget.category })}{' '}
              <span className="text-danger font-bold">{pct}%</span> {t('insightsLimitAlertTrail')}
            </p>
          ),
        });
        break;
      }
    }

    return result.slice(0, 4);
  }, [expenses, budgets, user, now, currentLang, t]);

  const isFree = user?.subscriptionStatus === 'free';

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-bg pb-28">
      <div className="px-5 pt-8 pb-2">
        <h1 className="font-display text-[28px] text-text">{t('insightsTitle')}</h1>
        <p className="text-[13px] text-muted mt-1">{monthLabel}</p>
      </div>

      <div className="px-5 mt-4 flex flex-col gap-3">
        {cards.length === 0 && (
          <p className="text-[15px] text-muted py-8 text-center">{t('insightsEmptyState')}</p>
        )}

        {cards.map((card) => (
          <CardShell key={card.id} card={card} footer={t('insightsFooter')} />
        ))}

        {isFree && (
          <div className="rounded-card border border-border p-5 flex items-center gap-3 mt-1">
            <Lock className="h-[18px] w-[18px] text-muted flex-shrink-0" strokeWidth={2.5} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-muted">{t('insightsLockedCard')}</p>
              <button onClick={onShowPaywall} className="mt-2 text-[13px] font-bold text-accent-deep min-h-[44px] -ml-1 px-1">
                {t('insightsUnlockPremium')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
