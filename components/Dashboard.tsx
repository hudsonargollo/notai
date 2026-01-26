import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Expense, Budget, Language, UserProfile } from '../types';
import { CreditCard, Zap, Crown, Search, TrendingUp, Target, ArrowUpRight, Camera, ShoppingBag, Utensils, Plane, Smartphone, Plus } from 'lucide-react';
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

const BentoCard = ({ children, className, onClick, delay = 0 }: { children?: React.ReactNode; className?: string; onClick?: () => void; delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
    onClick={onClick}
    className={`glass-panel rounded-[1.8rem] p-5 shadow-xl flex flex-col border border-white/5 active:scale-[0.98] transition-all relative overflow-hidden group ${className}`}
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
    <div className="h-full flex flex-col p-5 pb-28 overflow-hidden">
      <header className="flex justify-between items-center mb-5 pt-3">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-slate-500 font-black text-[9px] uppercase tracking-[0.4em] leading-none mb-1.5 opacity-60">Olá, {userProfile?.name?.split(' ')[0] || 'User'}</h2>
          <h1 className="text-2xl font-black text-white leading-none tracking-tight">Painel Principal</h1>
        </motion.div>
        <div className="flex gap-2">
          <motion.button 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            onClick={() => onNavigate('scan')} 
            className="p-2.5 glass-panel rounded-2xl border-energy-500/20 active:scale-90 bg-energy-500/5 transition-all"
          >
             <Camera className="h-5 w-5 text-energy-500" />
          </motion.button>
          <motion.button 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}
            onClick={onShowPaywall} 
            className="p-2.5 glass-panel rounded-2xl border-white/5 active:scale-90 transition-all"
          >
             <Crown className="h-5 w-5 text-amber-500 fill-amber-500/10" />
          </motion.button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0 overflow-hidden">
        {/* Bento: Large Spending Card */}
        <BentoCard className="col-span-2 h-[150px] justify-between bg-gradient-to-br from-slate-900/50 to-slate-950/50" delay={0.1}>
          <div className="flex justify-between items-start">
             <div>
                <p className="text-slate-500 font-black text-[9px] uppercase tracking-widest mb-1 opacity-70">Gasto este Mês</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white tracking-tighter">R$ {stats.totalMonthlySpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
             </div>
             <div className="bg-trust-500/10 p-2 rounded-xl">
               <TrendingUp className="text-trust-500 h-4 w-4" />
             </div>
          </div>
          
          <div className="h-[45px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData.slice(0, 5)}>
                  <Bar dataKey="amount" radius={[5, 5, 0, 0]}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'oklch(0.75 0.18 100)' : 'rgba(255,255,255,0.06)'} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* Bento: Small Interaction Cards */}
        <BentoCard className="justify-center items-center text-center group cursor-pointer hover:bg-white/5" onClick={onManageBudgets} delay={0.2}>
           <Target className="text-growth-500 h-6 w-6 mb-3 group-hover:scale-110 transition-transform" />
           <h4 className="font-black text-xs text-white">Metas</h4>
           <ArrowUpRight className="absolute top-3 right-3 h-3 w-3 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
        </BentoCard>

        <BentoCard className="justify-center items-center text-center group hover:bg-white/5" delay={0.3}>
           <Zap className="text-energy-500 h-6 w-6 mb-3 group-hover:scale-110 transition-transform" />
           <h4 className="font-black text-xs text-white">Neo Hub</h4>
        </BentoCard>

        {/* Bento: Activity Feed - Scrollable internally */}
        <BentoCard className="col-span-2 flex-1 min-h-0 flex flex-col bg-slate-900/30" delay={0.4}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Últimas Transações</h3>
            <div className="flex gap-2">
              <Search className="h-3.5 w-3.5 text-slate-700" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5">
            <AnimatePresence>
            {expenses.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center py-6 opacity-20">
                    <ShoppingBag className="h-8 w-8 mb-2" />
                    <p className="text-[9px] font-black uppercase tracking-widest">Sem Registros</p>
                </motion.div>
            ) : (
                expenses.map((expense, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.04) }}
                    key={expense.id} 
                    onClick={() => onEditExpense(expense)}
                    className="flex items-center justify-between p-3.5 rounded-2xl glass-panel border-white/5 bg-white/[0.01] hover:bg-white/[0.04] active:scale-[0.99] transition-all group"
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-slate-900/50 flex items-center justify-center border border-white/5 group-hover:border-energy-500/20 transition-all">
                        {expense.category === 'Food & Dining' ? <Utensils className="text-orange-400 h-4.5 w-4.5" /> :
                         expense.category === 'Transport' ? <Plane className="text-blue-400 h-4.5 w-4.5" /> :
                         expense.category === 'Bills & Utilities' ? <Smartphone className="text-purple-400 h-4.5 w-4.5" /> :
                         <CreditCard className="text-slate-500 h-4.5 w-4.5" />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-black text-[13px] text-white truncate leading-none mb-1">{expense.merchant_name}</p>
                        <span className="text-[8px] uppercase font-bold text-slate-600 tracking-wider">{t(expense.category)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-black text-[14px] text-white leading-none">R$ {expense.amount.toFixed(2)}</p>
                      <p className="text-[7px] text-slate-700 font-bold mt-1 uppercase">{new Date(expense.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                    </div>
                  </motion.div>
                ))
            )}
            </AnimatePresence>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};