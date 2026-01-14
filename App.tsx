import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { ReviewForm } from './components/ReviewForm';
import { BudgetModal } from './components/BudgetModal';
import { SettingsModal } from './components/SettingsModal';
import { AIAssistant } from './components/AIAssistant';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { Onboarding } from './components/Onboarding';
import { PaywallModal } from './components/PaywallModal';
import { getExpenses, processRecurringExpenses, getUserProfile, saveUserProfile, updateUserProfile, checkTrialStatus, clearUserProfile } from './services/expenseService';
import { Expense, AIReceiptResponse, Theme, Language, UserProfile } from './types';
import { PieChart, ScanLine, User } from 'lucide-react';
import { useTranslation } from './utils/i18n';

type View = 'dashboard' | 'scan' | 'review';
type AppState = 'splash' | 'login' | 'onboarding' | 'app';

function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [user, setUser] = useState<UserProfile | null>(null);

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  const [reviewData, setReviewData] = useState<AIReceiptResponse | Expense | null>(null);
  const [reviewImage, setReviewImage] = useState<string | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isSpecialOfferOpen, setIsSpecialOfferOpen] = useState(false);

  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('pt');

  const t = useTranslation(language);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    const splashTimer = setTimeout(() => {
        let storedUser = getUserProfile();
        if (storedUser) {
           storedUser = checkTrialStatus() || storedUser;
        }

        if (storedUser) {
            setUser(storedUser);
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

  const handleOnboardingComplete = (data: Partial<UserProfile>, showOffer?: boolean) => {
      if (user) {
          const updated = updateUserProfile(data);
          if (updated) setUser(updated);
          setAppState('app');
          if (showOffer) setIsSpecialOfferOpen(true);
      }
  };

  const handleScanComplete = (data: AIReceiptResponse, imageUrl: string) => {
    setReviewData(data);
    setReviewImage(imageUrl);
    setCurrentView('review');
  };

  const handleEditExpense = (expense: Expense) => {
    setReviewData(expense);
    setReviewImage(expense.receipt_image_url || null);
    setCurrentView('review');
  };

  const handleSaveExpense = () => {
    refreshExpenses();
    setCurrentView('dashboard');
    setReviewData(null);
    setReviewImage(null);
  };

  const handleLogout = () => {
      setUser(null);
      setAppState('login');
      setIsSettingsModalOpen(false);
      setCurrentView('dashboard');
      clearUserProfile();
  };

  const handleSubscribe = () => {
      if (user) {
          const updated = updateUserProfile({ subscriptionStatus: 'premium' });
          setUser(updated);
          setIsPaywallOpen(false);
          setIsSpecialOfferOpen(false);
      }
  };

  const handleStartTrial = () => {
      if (user) {
          const updated = updateUserProfile({ 
              subscriptionStatus: 'trial',
              trialStartDate: new Date().toISOString()
          });
          setUser(updated);
          setIsSpecialOfferOpen(false);
      }
  };

  const handleNavigation = (view: View) => {
      setCurrentView(view);
  };

  const BottomNav = () => {
    if (currentView === 'review' || currentView === 'scan') return null; 

    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel px-6 h-16 rounded-full flex items-center gap-12 z-40 shadow-2xl border-white/5">
        <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center transition-all ${currentView === 'dashboard' ? 'text-energy-500 scale-110' : 'text-slate-600'}`}>
          <PieChart className="h-6 w-6" />
        </button>
        {/* Bypass narrowing check as currentView is narrowed to 'dashboard' by the early return on line 150 */}
        <button onClick={() => setCurrentView('scan')} className={`flex flex-col items-center transition-all ${(currentView as string) === 'scan' ? 'text-energy-500 scale-110' : 'text-slate-600'}`}>
          <ScanLine className="h-6 w-6" />
        </button>
        <button onClick={() => setIsSettingsModalOpen(true)} className={`flex flex-col items-center text-slate-600 active:text-energy-500`}>
          <User className="h-6 w-6" />
        </button>
      </div>
    );
  };

  if (appState === 'splash') return <SplashScreen />;
  if (appState === 'login') return <LoginScreen onLogin={handleLogin} currentLang={language} />;
  if (appState === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} currentLang={language} />;

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 font-sans text-white">
      <main className="mx-auto max-w-lg h-full relative mesh-gradient">
        {currentView === 'dashboard' && (
          <Dashboard 
            expenses={expenses} 
            onManageBudgets={() => setIsBudgetModalOpen(true)}
            onEditExpense={handleEditExpense}
            onShowPaywall={() => setIsPaywallOpen(true)}
            onNavigate={handleNavigation}
            currentLang={language}
          />
        )}
        {currentView === 'scan' && (
          <Scanner onScanComplete={handleScanComplete} onCancel={() => setCurrentView('dashboard')} currentLang={language} />
        )}
        {currentView === 'review' && reviewData && (
          <ReviewForm initialData={reviewData} imageUrl={reviewImage || undefined} onSave={handleSaveExpense} onCancel={() => setCurrentView('dashboard')} currentLang={language} />
        )}
        
        <AIAssistant onClose={() => setCurrentView('dashboard')} currentLang={language} onNavigate={handleNavigation} onShowPaywall={() => setIsPaywallOpen(true)} />
      </main>

      <BottomNav />

      {isBudgetModalOpen && <BudgetModal onClose={() => setIsBudgetModalOpen(false)} onSave={refreshExpenses} currentLang={language} />}
      {isSettingsModalOpen && <SettingsModal onClose={() => setIsSettingsModalOpen(false)} onLogout={handleLogout} currentTheme={theme} onThemeChange={setTheme} currentLang={language} onLangChange={setLanguage} onShowPaywall={() => setIsPaywallOpen(true)} />}
      {isPaywallOpen && <PaywallModal onClose={() => setIsPaywallOpen(false)} onSubscribe={handleSubscribe} currentLang={language} />}
      {isSpecialOfferOpen && <PaywallModal onClose={() => setIsSpecialOfferOpen(false)} onSubscribe={handleSubscribe} onStartTrial={handleStartTrial} currentLang={language} specialOffer={true} />}
    </div>
  );
}

export default App;