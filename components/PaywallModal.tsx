import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../utils/i18n';

interface PaywallModalProps {
  onClose: () => void;
  onStartTrial: () => void;
  currentLang: Language;
}

const format = (str: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), str);

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onStartTrial, currentLang }) => {
  const t = useTranslation(currentLang);
  const locale = currentLang === 'pt' ? 'pt-BR' : 'en-US';

  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1, 1);
  const renewalLabel = renewalDate.toLocaleDateString(locale, { day: 'numeric', month: 'long' });

  const benefits = [t('paywallBenefit1'), t('paywallBenefit2'), t('paywallBenefit3')];

  const handleStartTrial = () => {
    onStartTrial();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="relative w-full max-w-lg bg-surface rounded-t-sheet px-6 pt-3 pb-8 shadow-elevated"
      >
        <div className="w-9 h-1 rounded-pill bg-border mx-auto mb-4" />
        <button
          onClick={onClose}
          aria-label={t('cancel')}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-muted"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <h2 className="font-display text-[24px] text-text pr-10">{t('paywallTitle')}</h2>
        <p className="text-[15px] text-muted mt-2">{format(t('paywallBody'), { date: renewalLabel })}</p>

        <div className="flex flex-col gap-3 mt-5">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3">
              <Check className="h-[18px] w-[18px] text-accent2-deep flex-shrink-0" strokeWidth={2.5} />
              <span className="text-[15px] text-text">{benefit}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleStartTrial}
          className="w-full h-[52px] rounded-pill bg-accent text-white font-bold text-[16px] mt-6"
        >
          {t('paywallCta')}
        </button>
        <p className="text-center text-[11px] text-muted mt-2">{t('paywallPriceNote')}</p>

        <button
          onClick={onClose}
          className="w-full h-[52px] rounded-pill text-accent-deep font-bold text-[16px] mt-2"
        >
          {t('paywallDecline')}
        </button>
      </motion.div>
    </div>
  );
};
