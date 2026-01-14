import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Expense, Budget, Language, UserProfile } from '../types';
import { CreditCard, Zap, Crown, Search, TrendingUp, Target, ArrowUpRight, Camera } from 'lucide-react';
import { getBudgets, getUserProfile } from '../services/expenseService';
import { useTranslation } from '../utils/i18n';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';

interface DashboardProps {
  expenses: Expense[];
  onManageBudgets: () => void;
  onEditExpense: (expense: Expense) => void;
  onShowPaywall: () => void;
  onNavigate: (view: 'dashboard' | 'scan') => void;
  currentLang: Language;
}

const BentoCard = ({ children, className, onClick }: { children?: React.ReactNode; className?: string; onClick?: () => void }) => (
  <motion.div 
    layout
    onClick={onClick}
    className={`glass-panel rounded-[1.2rem] p-3.5 shadow-lg flex flex-col border-white/5 active:scale-[0.98] transition-all ${className}`}
  >
    {children}
  </motion.div>
);

export const Dashboard: React.FC<DashboardProps> = ({ expenses, onManageBudgets, onEditExpense, onShowPaywall, onNavigate, currentLang }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const t = useTranslation(currentLang);

  useEffect(() => {
    setUserProfile(getUserProfile());
  }, [expenses]);

  const stats = useMemo(() => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    let totalMonthlySpent = 0;
    const monthlyCategoryTotals: Record<string, number> = {};
    expenses.forEach(e => {
      if (e.date >= startOfMonth) {
        monthlyCategoryTotals[e.category] = (monthlyCategoryTotals[e.category] || 0) + e.amount;
        totalMonthlySpent += e.amount;
      }
    });

    const chartData = Object.entries(monthlyCategoryTotals).map(([cat, amount]) => ({
      name: t(cat),
      amount
    })).sort((a, b) => b.amount - a.amount);

    return { totalMonthlySpent, chartData };
  }, [expenses, t]);

  return (
    <div className="h-full flex flex-col p-4 pb-24 overflow-hidden">
      <header className="flex justify-between items-center mb-4 pt-2">
        <div>
          <h2 className="text-slate-500 font-black text-[8px] uppercase tracking-widest leading-none mb-1">Olá, {userProfile?.name?.split(' ')[0] || 'User'}</h2>
          <h1 className="text-xl font-black text-white leading-none">Fluxo Mensal</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onNavigate('scan')} className="p-2.5 glass-panel rounded-lg border-energy-500/20 active:scale-90 bg-energy-500/5 transition-all">
             <Camera className="h-4 w-4 text-energy-500" />
          </button>
          <button onClick={onShowPaywall} className="p-2.5 glass-panel rounded-lg border-white/5 active:scale-90 transition-all">
             <Crown className="h-4 w-4 text-yellow-500" />
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-2 gap-3 min-h-0 overflow-hidden">
        {/* Expenditure Summary - Spans 2 cols */}
        <BentoCard className="col-span-2 overflow-hidden h-[120px]">
          <div className="flex justify-between items-start mb-1">
             <div>
                <p className="text-slate-500 font-black text-[8px] uppercase tracking-widest">Gasto Total</p>
                <span className="text-2xl font-black text-white">R$ {stats.totalMonthlySpent.toLocaleString('pt-BR')}</span>
             </div>
             <TrendingUp className="text-trust-500 h-3 w-3" />
          </div>
          
          <div className="flex-1 w-full opacity-60">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData.slice(0, 4)}>
                  <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'oklch(0.75 0.18 100)' : 'rgba(255,255,255,0.1)'} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* Categories Control */}
        <BentoCard className="justify-between cursor-pointer" onClick={onManageBudgets}>
           <div className="bg-growth-500/10 w-fit p-2 rounded-lg mb-2">
             <Target className="text-growth-500 h-4 w-4" />
           </div>
           <div>
             <h4 className="font-black text-xs text-white">Minhas Metas</h4>
             <p className="text-[8px] uppercase font-bold text-slate-500 mt-0.5">Controlar Gastos</p>
           </div>
        </BentoCard>

        {/* AI Health */}
        <BentoCard className="justify-between">
           <div className="bg-energy-500/10 w-fit p-2 rounded-lg mb-2">
             <Zap className="text-energy-500 h-4 w-4" />
           </div>
           <div>
             <h4 className="font-black text-xs text-white">Neo Status</h4>
             <p className="text-[8px] uppercase font-bold text-slate-500 mt-0.5">Núcleo Saudável</p>
           </div>
        </BentoCard>

        {/* Activity List - Spans 2 cols */}
        <BentoCard className="col-span-2 flex-1 min-h-0 flex flex-col bg-slate-900/30">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atividade</h3>
            <Search className="h-3 w-3 text-slate-600" />
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-0.5">
            {expenses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <Zap className="h-8 w-8 mb-2" />
                    <p className="text-[8px] font-bold uppercase tracking-widest">Sem Registros</p>
                </div>
            ) : (
                expenses.map((expense, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={expense.id} 
                    onClick={() => onEditExpense(expense)}
                    className="flex items-center justify-between p-3 rounded-xl glass-panel border-white/5 active:border-energy-500/20 transition-all"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                        <CreditCard className="text-slate-500 h-3.5 w-3.5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-xs text-white truncate leading-none mb-1">{expense.merchant_name}</p>
                        <p className="text-[8px] uppercase font-bold text-slate-500 truncate tracking-tighter">{t(expense.category)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-black text-xs text-white leading-none">R$ {expense.amount.toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        </BentoCard>
      </div>
    </div>
  );
};