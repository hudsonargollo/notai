import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Capture } from './components/Capture';
import { Settings } from './components/Settings';
import { Insights } from './components/Insights';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { Onboarding } from './components/Onboarding';
import { PaywallModal } from './components/PaywallModal';
import { getExpenses, processRecurringExpenses, getUserProfile, saveUserProfile, updateUserProfile, checkTrialStatus, clearUserProfile } from './services/expenseService';
import { Expense, Theme, Language, UserProfile } from './types';
import { Camera, Home as HomeIcon, PieChart, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from './utils/i18n';

type View = 'home' | 'insights' | 'settings' | 'capture';
type AppState = 'splash' | 'login' | 'onboarding' | 'app';

function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [user, setUser] = useState<UserProfile | null>(null);

  const [currentView, setCurrentView] = useState<View>('home');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [highlightedExpenseId, setHighlightedExpenseId] = useState<string | null>(null);

  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const [theme, setTheme] = useState<Theme>('system');
  const [language, setLanguage] = useState<Language>('pt');

  const t = useTranslation(language);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
        let storedUser = getUserProfile();
        if (storedUser) {
           storedUser = checkTrialStatus() || storedUser;
        }

        if (storedUser) {
            setUser(storedUser);
            setTheme(storedUser.themePreference || 'system');
            setLanguage(storedUser.languagePreference || 'pt');
            if (storedUser.onboardingCompleted) {
                setAppState('app');
            } else {
                setAppState('onboarding');
            }
        } else {
            setAppState('login');
        }
    }, 2500);

    processRecurringExpenses();
    refreshExpenses();

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && media.matches);
      if (isDark) {
        document.documentElement.dataset.theme = 'dark';
      } else {
        delete document.documentElement.dataset.theme;
      }
    };
    applyTheme();
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);

  const refreshExpenses = () => {
    setExpenses(getExpenses());
  };

  const handleLogin = () => {
      const newUser: UserProfile = {
          id: 'user_' + Date.now(),
          name: '',
          email: 'user@example.com',
          onboardingCompleted: false,
          currencyPreference: 'BRL',
          subscriptionStatus: 'free',
          aiInteractionCount: 0
      };
      saveUserProfile(newUser);
      setUser(newUser);
      setAppState('onboarding');
  };

  const handleOnboardingComplete = (data: Partial<UserProfile>) => {
      if (user) {
          const updated = updateUserProfile(data);
          if (updated) setUser(updated);
          setAppState('app');
      }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setCurrentView('capture');
  };

  const handleSaveExpense = (saved: Expense) => {
    refreshExpenses();
    setCurrentView('home');
    setEditingExpense(null);
    setHighlightedExpenseId(saved.id);
    setTimeout(() => setHighlightedExpenseId(null), 1000);
  };

  const handleCancelCapture = () => {
    setCurrentView('home');
    setEditingExpense(null);
  };

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
      const updated = updateUserProfile(updates);
      if (updated) setUser(updated);
  };

  const handleLogout = () => {
      setUser(null);
      setAppState('login');
      setCurrentView('home');
      clearUserProfile();
  };

  const handleStartTrial = () => {
      if (user) {
          const updated = updateUserProfile({
              subscriptionStatus: 'trial',
              trialStartDate: new Date().toISOString()
          });
          setUser(updated);
          setIsPaywallOpen(false);
      }
  };

  const BottomNav = () => {
    if (currentView === 'capture') return null;

    const tabs: { view: View; label: string; icon: React.ReactNode }[] = [
      { view: 'home', label: t('navHome'), icon: <HomeIcon className="h-6 w-6" strokeWidth={2.5} /> },
      { view: 'insights', label: t('navInsights'), icon: <PieChart className="h-6 w-6" strokeWidth={2.5} /> },
      { view: 'settings', label: t('navSettings'), icon: <SettingsIcon className="h-6 w-6" strokeWidth={2.5} /> },
    ];

    return (
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-surface border-t border-border">
        <div className="h-20 px-6 flex items-center justify-between relative">
          {tabs.slice(0, 2).map((tab) => (
            <button
              key={tab.view}
              onClick={() => setCurrentView(tab.view)}
              className={`flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center ${currentView === tab.view ? 'text-accent-deep' : 'text-muted'}`}
            >
              {tab.icon}
              <span className="text-[11px] font-semibold">{tab.label}</span>
            </button>
          ))}

          <button
            onClick={() => setCurrentView('capture')}
            aria-label="Capture"
            className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-elevated"
          >
            <Camera className="h-6 w-6" strokeWidth={2.5} />
          </button>

          {tabs.slice(2).map((tab) => (
            <button
              key={tab.view}
              onClick={() => setCurrentView(tab.view)}
              className={`flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center ${currentView === tab.view ? 'text-accent-deep' : 'text-muted'}`}
            >
              {tab.icon}
              <span className="text-[11px] font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  let content: React.ReactNode;

  if (appState === 'splash') {
    content = <SplashScreen currentLang={language} />;
  } else if (appState === 'login') {
    content = <LoginScreen onLogin={handleLogin} currentLang={language} />;
  } else if (appState === 'onboarding') {
    content = <Onboarding onComplete={handleOnboardingComplete} currentLang={language} />;
  } else {
    content = (
      <>
        <main className="h-full relative">
          {currentView === 'home' && (
            <Dashboard
              expenses={expenses}
              user={user}
              onEditExpense={handleEditExpense}
              onOpenSettings={() => setCurrentView('settings')}
              onOpenInsights={() => setCurrentView('insights')}
              currentLang={language}
              highlightedExpenseId={highlightedExpenseId}
            />
          )}

          {currentView === 'capture' && (
            <Capture
              initialExpense={editingExpense || undefined}
              onSaveComplete={handleSaveExpense}
              onCancel={handleCancelCapture}
              onShowPaywall={() => setIsPaywallOpen(true)}
              currentLang={language}
            />
          )}

          {currentView === 'insights' && (
            <Insights onNavigateHome={() => setCurrentView('home')} currentLang={language} onShowPaywall={() => setIsPaywallOpen(true)} />
          )}

          {currentView === 'settings' && (
            <Settings
              user={user}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              theme={theme}
              onThemeChange={setTheme}
              currentLang={language}
              onLangChange={setLanguage}
              onShowPaywall={() => setIsPaywallOpen(true)}
            />
          )}
        </main>

        <BottomNav />

        {isPaywallOpen && <PaywallModal onClose={() => setIsPaywallOpen(false)} onStartTrial={handleStartTrial} currentLang={language} />}
      </>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-surface-2 flex items-center justify-center">
      <div className="relative w-full h-full max-w-[430px] overflow-hidden bg-bg font-sans text-text">
        {content}
      </div>
    </div>
  );
}

export default App;
