import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Trash2, Sparkles, User, Zap, MessageCircle, TrendingUp } from 'lucide-react';
import { useTranslation } from '../utils/i18n';
import { Language, UserProfile, AVATAR_URL } from '../types';
import { getCategories, saveCategories } from '../services/expenseService';
import { PageTransition } from '../src/components/layout/PageTransition';
import { Card, CardContent, CardFooter, CardHeader } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { Input } from '../src/components/ui/input';
import { scaleOnHover, fadeInUp, staggerContainer, staggerItem } from '../src/lib/animations';

interface OnboardingProps {
  onComplete: (profileData: Partial<UserProfile>, showOffer?: boolean) => void;
  currentLang: Language;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, currentLang }) => {
  const t = useTranslation(currentLang);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [categories, setCategories] = useState(getCategories());
  const [newCategory, setNewCategory] = useState('');
  const [neoDialogue, setNeoDialogue] = useState('E aí! Eu sou o Neo, seu parceiro de inteligência financeira.');

  useEffect(() => {
    if (step === 0) setNeoDialogue('Sou o Neo. Primeiro, como devo te chamar?');
    if (step === 1) setNeoDialogue(`Prazer, ${name}! Qual o seu objetivo de gastos para este mês?`);
    if (step === 2) setNeoDialogue('Show! E sobre as categorias? Dá uma olhada se falta alguma coisa aqui.');
    if (step === 3) setNeoDialogue('Maravilha! Já preparei seu painel. Vamos assumir o controle do seu dinheiro?');
  }, [step, name]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete({ name, monthlyBudget: parseFloat(monthlyBudget) || 0, onboardingCompleted: true }, true);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updated = [...categories, newCategory.trim()];
      setCategories(updated);
      saveCategories(updated);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    saveCategories(updated);
  };

  return (
    <PageTransition pageKey={`onboarding-step-${step}`}>
      <div className="h-full w-full flex flex-col p-6 items-center justify-between font-sans overflow-hidden mesh-gradient">
        {/* Progress Indicators */}
        <div className="w-full flex justify-center pt-4">
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(i => (
              <motion.div 
                key={i} 
                initial={false}
                animate={{ 
                  width: step === i ? 24 : 8,
                  backgroundColor: step >= i ? 'oklch(0.75 0.18 100)' : 'rgba(255,255,255,0.05)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-1.5 rounded-full shadow-sm" 
              />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-8">
          {/* Neo Interaction Area */}
          <div className="flex flex-col items-center gap-4 w-full">
            <motion.div 
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full glass-panel flex items-center justify-center p-4 relative ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <img src={AVATAR_URL} alt="Neo" className="w-full h-full object-contain" />
              <motion.div 
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-1 -right-1 bg-energy-500 p-2 rounded-xl shadow-lg border border-white/20"
              >
                <Zap className="h-4 w-4 text-white fill-white" strokeWidth={2} />
              </motion.div>
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={neoDialogue}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="glass-panel p-5 rounded-[2.2rem] relative w-full border border-energy-500/10 shadow-xl"
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-slate-900 px-2">
                  <MessageCircle className="h-4 w-4 text-energy-500 fill-energy-500/20" strokeWidth={2} />
                </div>
                <p className="text-[14px] font-bold leading-relaxed text-center text-slate-100">
                  {neoDialogue}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Input Zones - Using Card for each step */}
          <div className="w-full min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={step}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                {step === 0 && (
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-energy-500 transition-colors z-10" strokeWidth={2} />
                        <Input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome..."
                          className="w-full bg-white/5 border-white/10 rounded-[1.8rem] py-5 pl-14 pr-6 text-lg font-black text-white focus:border-energy-500/40 placeholder:text-slate-800"
                          autoFocus
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {step === 1 && (
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="relative group">
                        <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-trust-500 transition-colors z-10" strokeWidth={2} />
                        <Input 
                          type="number" 
                          value={monthlyBudget}
                          onChange={(e) => setMonthlyBudget(e.target.value)}
                          placeholder="Ex: 2500"
                          className="w-full bg-white/5 border-white/10 rounded-[1.8rem] py-5 pl-14 pr-14 text-lg font-black text-white focus:border-trust-500/40 placeholder:text-slate-800"
                          autoFocus
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-500">R$</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {step === 2 && (
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex gap-2">
                        <Input 
                          type="text" 
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                          placeholder="Nova categoria..."
                          className="flex-1 bg-white/5 border-white/10 rounded-2xl px-5 py-3.5 font-bold text-sm text-white focus:border-energy-500/30"
                        />
                        <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
                          <Button 
                            onClick={handleAddCategory} 
                            className="px-5 bg-energy-500 rounded-2xl shadow-lg shadow-energy-500/20 hover:bg-energy-600"
                            size="icon"
                          >
                            <Check className="h-4 w-4" strokeWidth={2} />
                          </Button>
                        </motion.div>
                      </div>
                      <motion.div 
                        className="grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto no-scrollbar pr-1"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                      >
                        {categories.map(cat => (
                          <motion.div 
                            layout
                            key={cat}
                            variants={staggerItem}
                            className="glass-panel py-2 px-3 rounded-xl flex items-center justify-between border-white/5 bg-white/5"
                          >
                            <span className="font-black text-[9px] truncate pr-2 uppercase tracking-tight text-slate-300">{t(cat)}</span>
                            <button 
                              onClick={() => handleRemoveCategory(cat)} 
                              className="text-slate-600 hover:text-red-400 active:scale-110 transition-all"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={2} />
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                )}

                {step === 3 && (
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="pt-6 flex flex-col items-center gap-4">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-trust-500/10 p-6 rounded-full border border-trust-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                      >
                        <Sparkles className="h-6 w-6 text-trust-500" strokeWidth={2} />
                      </motion.div>
                      <div className="text-center">
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Fluxo Pronto</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">O Neo está online e pronto para você.</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3 pb-8 safe-pb">
          <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
            <Button 
              onClick={handleNext}
              disabled={(step === 0 && !name.trim()) || (step === 1 && !monthlyBudget)}
              className="w-full bg-white text-slate-950 disabled:opacity-30 font-black py-4.5 rounded-[1.8rem] shadow-[0_15px_30px_rgba(255,255,255,0.08)] hover:bg-slate-50 text-lg"
              size="lg"
            >
              {step === 3 ? "Bora Começar!" : "Tudo Certo"}
              <ChevronRight className="ml-2 h-6 w-6" strokeWidth={2} />
            </Button>
          </motion.div>
          <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-[0.3em] opacity-40">not.AÍ • Spatial Intelligence</p>
        </div>
      </div>
    </PageTransition>
  );
};