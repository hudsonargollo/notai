import React from 'react';
import { useTranslation } from '../utils/i18n';
import { Language } from '../types';

interface SplashScreenProps {
  currentLang?: Language;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ currentLang = 'pt' }) => {
  const t = useTranslation(currentLang);

  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-accent" aria-hidden="true" />
        <h1 className="font-display text-[40px] leading-[1.1] text-text lowercase">
          not<span className="text-accent-deep">aí</span>
        </h1>
        <p className="text-[13px] text-muted">{t('splashTagline')}</p>
      </div>
    </div>
  );
};
