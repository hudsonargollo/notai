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
  const [neoDialogue, setNeoDialogue] = useState('Olá! Eu sou o Neo, seu novo assistente financeiro.');

  useEffect(() => {
    if (step === 0) setNeoDialogue('Sou o Neo. Primeiro, como posso te chamar?');
    if (step === 1) setNeoDialogue(`Prazer em te conhecer, ${name}! Estas são suas categorias. Tudo certo?`);
    if (step === 2) setNeoDialogue('Perfeito! Agora está tudo pronto para começarmos a organizar sua vida financeira.');
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
    <div className="h-full w-full flex flex-col p-6 items-center justify-between font-sans overflow-hidden bg-slate-950/20">
      {/* Dynamic Header */}
      <div className="w-full flex justify-between items-center py-2">
         <div className="flex items-center gap-2">
            <div className="bg-energy-500/10 p-1.5 rounded-lg border border-energy-500/20">
              <Bot className="h-4 w-4 text-energy-500" />
            </div>
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-500">Neo Onboarding</span>
         </div>
         <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-energy-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'w-2 bg-white/5'}`} />
            ))}
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-8">
        {/* Neo Interaction Point */}
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ y: [0, -5, 0], scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-20 h-20 rounded-full glass-panel flex items-center justify-center p-3 relative ring-1 ring-white/5"
          >
            <img src={AVATAR_URL} alt="Neo" className="w-full h-full object-contain" />
            <div className="absolute -bottom-1 -right-1 bg-energy-500 p-1 rounded-md shadow-lg">
              <Zap className="h-3 w-3 text-white fill-white" />
            </div>
          </motion.div>
          
          <motion.div 
            key={neoDialogue}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-2xl relative max-w-[280px]"
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 border-8 border-transparent border-bottom-white/5 rotate-180"></div>
            <p className="text-xs font-bold leading-relaxed text-center text-slate-200">
               {neoDialogue}
            </p>
          </motion.div>
        </div>

        {/* Dynamic Inputs Area */}
        <div className="w-full min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="w-full"
            >
              {step === 0 && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como se chama?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-base font-bold text-white focus:outline-none focus:border-energy-500/50 transition-all placeholder:text-slate-800"
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
                      placeholder="Adicionar..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none font-bold text-xs text-white"
                    />
                    <button onClick={handleAddCategory} className="px-3 bg-energy-500 rounded-xl active:scale-90 transition-transform">
                      <Check className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto no-scrollbar pr-1">
                    {categories.map(cat => (
                      <div key={cat} className="glass-panel py-2 px-3 rounded-lg flex items-center justify-between border-white/5">
                        <span className="font-bold text-[10px] truncate pr-1">{t(cat)}</span>
                        <button onClick={() => handleRemoveCategory(cat)} className="text-slate-600 active:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-energy-500/10 p-4 rounded-full">
                    <Sparkles className="h-8 w-8 text-energy-500" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sistemas Prontos</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4 safe-pb">
        <button 
          onClick={handleNext}
          disabled={step === 0 && !name.trim()}
          className="w-full bg-white text-slate-950 disabled:opacity-30 font-black py-4 rounded-xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-all active:scale-[0.98] flex items-center justify-center text-sm"
        >
          {step === 2 ? "Explorar Not.AÍ" : "Continuar"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </button>
        <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-tighter">Ao continuar, você concorda com os termos de IA</p>
      </div>
    </div>
  );
};