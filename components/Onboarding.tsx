import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Trash2, Bot, Sparkles, User, Zap } from 'lucide-react';
import { useTranslation } from '../utils/i18n';
import { Language, UserProfile, AVATAR_URL } from '../types';
import { getCategories, saveCategories } from '../services/expenseService';

interface OnboardingProps {
  onComplete: (profileData: Partial<UserProfile>, showOffer?: boolean) => void;
  currentLang: Language;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, currentLang }) => {
  const t = useTranslation(currentLang);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState(getCategories());
  const [newCategory, setNewCategory] = useState('');
  const [neoDialogue, setNeoDialogue] = useState('Olá! Eu sou o Neo, seu assistente inteligente.');

  useEffect(() => {
    if (step === 0) setNeoDialogue('Sou o Neo. Primeiro, como posso te chamar?');
    if (step === 1) setNeoDialogue(`Show de bola, ${name}! Estas são suas categorias iniciais. Tudo certo?`);
    if (step === 2) setNeoDialogue('Maravilha! Seu painel está pronto. Vamos começar a economizar?');
  }, [step, name]);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else onComplete({ name, onboardingCompleted: true }, true);
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
    <div className="h-full w-full flex flex-col p-6 items-center justify-between font-sans overflow-hidden">
      {/* Mini Progress */}
      <div className="w-full flex justify-center pt-2">
         <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-energy-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'w-2.5 bg-white/5'}`} />
            ))}
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-6">
        {/* Neo Centerpiece */}
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-20 h-20 rounded-full glass-panel flex items-center justify-center p-3 relative ring-1 ring-white/5"
          >
            <img src={AVATAR_URL} alt="Neo" className="w-full h-full object-contain" />
            <div className="absolute -bottom-1 -right-1 bg-energy-500 p-1.5 rounded-lg shadow-lg">
              <Zap className="h-3 w-3 text-white fill-white" />
            </div>
          </motion.div>
          
          <motion.div 
            key={neoDialogue}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-4 rounded-2xl relative max-w-[260px] border border-energy-500/10"
          >
            <p className="text-sm font-bold leading-tight text-center text-slate-100">
               {neoDialogue}
            </p>
          </motion.div>
        </div>

        {/* Dynamic Inputs - Compact */}
        <div className="w-full min-h-[140px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              {step === 0 && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome ou Apelido"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-base font-black text-white focus:outline-none focus:border-energy-500/30 transition-all placeholder:text-slate-800"
                    autoFocus
                  />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                      placeholder="Nova categoria..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none font-bold text-xs text-white"
                    />
                    <button onClick={handleAddCategory} className="px-3 bg-energy-500 rounded-xl active:scale-90">
                      <Check className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-[90px] overflow-y-auto no-scrollbar pr-1">
                    {categories.map(cat => (
                      <div key={cat} className="glass-panel py-2 px-3 rounded-lg flex items-center justify-between border-white/5">
                        <span className="font-black text-[9px] truncate pr-1 uppercase tracking-tighter">{t(cat)}</span>
                        <button onClick={() => handleRemoveCategory(cat)} className="text-slate-600 active:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-energy-500/10 p-4 rounded-full border border-energy-500/20">
                    <Sparkles className="h-8 w-8 text-energy-500" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fluxo Pronto</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3 pb-8 safe-pb">
        <button 
          onClick={handleNext}
          disabled={step === 0 && !name.trim()}
          className="w-full bg-white text-slate-950 disabled:opacity-30 font-black py-4.5 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center text-base"
        >
          {step === 2 ? "Acessar Painel" : "Próximo"}
          <ChevronRight className="ml-1 h-5 w-5" />
        </button>
        <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-tighter opacity-60">not.AÍ • Inteligência Financeira</p>
      </div>
    </div>
  );
};