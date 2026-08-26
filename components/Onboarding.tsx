import React, { useState } from 'react';
import { useTranslation } from '../utils/i18n';
import { Language, UserProfile } from '../types';
import { PageTransition } from '../src/components/layout/PageTransition';

interface OnboardingProps {
  onComplete: (profileData: Partial<UserProfile>) => void;
  currentLang: Language;
}

const QUICK_PICKS = [1500, 2500, 4000];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, currentLang }) => {
  const t = useTranslation(currentLang);
  const [step, setStep] = useState<0 | 1>(0);
  const [name, setName] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');

  const canContinue = step === 0
    ? name.trim().length > 0
    : monthlyBudget.trim().length > 0 && parseFloat(monthlyBudget) > 0;

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    onComplete({
      name: name.trim(),
      monthlyBudget: parseFloat(monthlyBudget) || 0,
      onboardingCompleted: true,
    });
  };

  return (
    <PageTransition pageKey={`onboarding-step-${step}`}>
      <div className="h-full w-full bg-bg flex flex-col px-6 pt-10 pb-8 safe-pb">
        <div className="flex flex-col items-center gap-3 pt-4">
          <span className="text-[11px] font-semibold text-muted">
            {t('onboardingStepOf').replace('{n}', String(step + 1))}
          </span>
          <div className="flex gap-2">
            {[0, 1].map((i) => (
              <div key={i} className={`h-2 w-2 rounded-full ${step >= i ? 'bg-accent' : 'bg-surface-2'}`} />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center w-full max-w-sm mx-auto gap-6">
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <h1 className="font-display text-[28px] text-text text-center">{t('onboardingStep1Title')}</h1>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                placeholder={t('onb_name_placeholder')}
                className="w-full rounded-input bg-surface-2 border border-border px-4 py-4 text-[16px] text-text text-center placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h1 className="font-display text-[28px] text-text text-center">{t('onboardingStep2Title')}</h1>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-muted">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  autoFocus
                  placeholder="0"
                  className="w-full rounded-input bg-surface-2 border border-border pl-11 pr-4 py-4 text-[16px] text-text tabular-nums placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                {QUICK_PICKS.map((amount) => {
                  const selected = parseFloat(monthlyBudget) === amount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setMonthlyBudget(String(amount))}
                      className={`h-11 px-4 rounded-pill text-[15px] font-semibold transition-colors ${
                        selected ? 'bg-accent text-white' : 'bg-surface-2 text-text'
                      }`}
                    >
                      R$ {amount.toLocaleString('pt-BR')}
                    </button>
                  );
                })}
              </div>
              <p className="text-[13px] text-muted text-center">{t('onboardingHint')}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!canContinue}
          className="h-[52px] rounded-pill bg-accent text-white font-bold text-[16px] disabled:opacity-40 active:brightness-95 transition-[filter,opacity]"
        >
          {step === 0 ? t('onboardingContinue') : t('onboardingStart')}
        </button>
      </div>
    </PageTransition>
  );
};
