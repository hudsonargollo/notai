
import React from 'react';
import { X, Check, Star, Lock, Sparkles } from 'lucide-react';
import { Language, AVATAR_URL } from '../types';
import { useTranslation } from '../utils/i18n';

interface PaywallModalProps {
  onClose: () => void;
  onSubscribe: () => void;
  currentLang: Language;
  specialOffer?: boolean;
  onStartTrial?: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onSubscribe, currentLang, specialOffer, onStartTrial }) => {
  const t = useTranslation(currentLang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
        
        {/* Close Button */}
        <button 
           onClick={onClose} 
           className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 p-2 rounded-full z-10"
        >
           <X className="h-5 w-5" />
        </button>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-emerald-900 to-slate-900 p-8 flex flex-col items-center text-center">
            {specialOffer && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg shadow-yellow-500/20 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1 fill-current" /> Limited Time
                </div>
            )}
            
            <div className="relative w-32 h-32 mb-4 animate-float">
                <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl"></div>
                <img 
                    src={AVATAR_URL} 
                    alt="Neo Premium" 
                    className="w-full h-full object-contain relative z-10"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-full border-4 border-slate-900">
                    <Star className="h-6 w-6 fill-current" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
                {specialOffer ? t('specialOfferTitle') : t('premiumTitle')}
            </h2>
            <p className="text-slate-300">
                {specialOffer ? t('specialOfferDesc') : t('premiumDesc')}
            </p>
        </div>

        {/* Benefits */}
        <div className="p-6 space-y-4">
            <div className="flex items-center text-slate-200">
                <div className="bg-emerald-500/20 p-2 rounded-full mr-3 text-emerald-400">
                    <Check className="h-5 w-5" />
                </div>
                <span>{t('benefit1')}</span>
            </div>
            <div className="flex items-center text-slate-200">
                <div className="bg-emerald-500/20 p-2 rounded-full mr-3 text-emerald-400">
                    <Check className="h-5 w-5" />
                </div>
                <span>{t('benefit2')}</span>
            </div>
            <div className="flex items-center text-slate-200">
                <div className="bg-emerald-500/20 p-2 rounded-full mr-3 text-emerald-400">
                    <Check className="h-5 w-5" />
                </div>
                <span>{t('benefit3')}</span>
            </div>
        </div>

        {/* Pricing & CTA */}
        <div className="p-6 pt-0">
             <div className="text-center mb-6">
                <span className="text-slate-500 line-through text-sm block mb-1">{t('priceAnchor')}</span>
                <span className="text-3xl font-bold text-white block">
                    {specialOffer ? t('priceSpecial') : t('priceFinal')}
                </span>
             </div>
             
             <button 
                onClick={onSubscribe}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
             >
                <Lock className="h-5 w-5 mr-2" />
                {t('subscribe')}
             </button>

             {specialOffer && onStartTrial && (
                 <button 
                    onClick={onStartTrial}
                    className="w-full mt-3 bg-white/5 border border-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/10 transition-colors"
                 >
                    {t('startTrial')}
                 </button>
             )}
             
             <button onClick={onClose} className="w-full text-center text-slate-500 text-xs mt-4 hover:text-white transition-colors">
                {t('restore')}
             </button>
        </div>
      </div>
    </div>
  );
};
