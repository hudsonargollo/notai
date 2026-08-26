import React, { useState } from 'react';
import { useTranslation } from '../utils/i18n';
import { Language } from '../types';
import { PageTransition } from '../src/components/layout/PageTransition';

interface LoginScreenProps {
  onLogin: () => void;
  currentLang: Language;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, currentLang }) => {
  const t = useTranslation(currentLang);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!email.trim() || !email.includes('@')) {
      setError(t('errorInvalidEmail'));
      return;
    }
    setError('');
    onLogin();
  };

  return (
    <PageTransition>
      <div className="h-full w-full bg-bg flex flex-col px-6 pt-16 pb-10 safe-pb overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center text-center gap-3 mb-10">
          <span className="font-display text-[28px] text-text lowercase">
            not<span className="text-accent-deep">aí</span>
          </span>
          <h1 className="font-display text-[28px] text-text mt-4">{t('loginTitle')}</h1>
          <p className="text-[15px] text-muted">{t('loginSubtitle')}</p>
        </div>

        <div className="flex flex-col gap-5 w-full max-w-sm mx-auto flex-1">
          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-muted">{t('loginEmailLabel')}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('loginEmailPlaceholder')}
              className="w-full rounded-input bg-surface-2 border border-border px-4 py-4 text-[16px] text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {error && <span className="text-[13px] text-danger">{error}</span>}
          </label>

          <button
            onClick={handleContinue}
            className="h-[52px] rounded-pill bg-accent text-white font-bold text-[16px] active:brightness-95 transition-[filter]"
          >
            {t('loginContinue')}
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[13px] text-muted">{t('loginOr')}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={onLogin}
            className="h-[52px] rounded-pill bg-surface-2 text-text font-bold text-[16px] flex items-center justify-center gap-2 active:brightness-95 transition-[filter]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-text">
              <path d="M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.71h5.4a4.62 4.62 0 01-2 3.03v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.28z" fill="currentColor" opacity=".55" />
              <path d="M12 22c2.7 0 4.96-.89 6.62-2.42l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.12H3.05v2.58A10 10 0 0012 22z" fill="currentColor" opacity=".75" />
              <path d="M6.41 13.92A6 6 0 016.09 12c0-.67.12-1.32.32-1.92V7.5H3.05A10 10 0 002 12c0 1.61.39 3.14 1.05 4.5l3.36-2.58z" fill="currentColor" opacity=".4" />
              <path d="M12 6.58c1.47 0 2.79.5 3.83 1.49l2.87-2.87A9.96 9.96 0 0012 2a10 10 0 00-8.95 5.5l3.36 2.58C7.2 8.33 9.4 6.58 12 6.58z" fill="currentColor" opacity=".9" />
            </svg>
            <span>{t('googleSignIn')}</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-muted mt-8">
          <span className="text-accent-deep">{t('loginTerms')}</span> · <span className="text-accent-deep">{t('loginPrivacy')}</span>
        </p>
      </div>
    </PageTransition>
  );
};
