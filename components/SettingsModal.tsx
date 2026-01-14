

import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, Globe, Plus, Trash2, Edit2, Check, User, LogOut, Crown, Lock } from 'lucide-react';
import { Theme, Language, UserProfile } from '../types';
import { useTranslation } from '../utils/i18n';
import { getCategories, saveCategories, updateCategoryName, getUserProfile, canAddCategory } from '../services/expenseService';

interface SettingsModalProps {
  onClose: () => void;
  onLogout: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  onShowPaywall: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  onClose, 
  onLogout,
  currentTheme, 
  onThemeChange,
  currentLang,
  onLangChange,
  onShowPaywall
}) => {
  const t = useTranslation(currentLang);
  const user = getUserProfile();
  const [categories, setCategories] = useState<string[]>(getCategories());
  const [newCategory, setNewCategory] = useState('');
  
  // Edit State
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddCategory = () => {
    if (!canAddCategory()) {
        alert(t('catLimitReached'));
        return;
    }

    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updated = [...categories, newCategory.trim()];
      setCategories(updated);
      saveCategories(updated);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    if (confirm(`Delete category "${cat}"? Expenses will remain but category assignment might be inconsistent.`)) {
        const updated = categories.filter(c => c !== cat);
        setCategories(updated);
        saveCategories(updated);
    }
  };

  const startEditing = (cat: string) => {
    setEditingCategory(cat);
    setEditValue(cat);
  };

  const saveEdit = () => {
    if (editingCategory && editValue.trim() && editValue !== editingCategory) {
        updateCategoryName(editingCategory, editValue.trim());
        setCategories(getCategories()); // Reload from storage
    }
    setEditingCategory(null);
    setEditValue('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={onClose} 
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">{t('profile')}</h1>
          <div className="w-8"></div>
      </div>

      <div className="max-w-lg mx-auto p-6 pb-24 space-y-8">
        
        {/* Subscription Banner */}
        {user?.subscriptionStatus === 'premium' ? (
             <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <Crown className="absolute -right-4 -bottom-4 h-24 w-24 opacity-20 rotate-12" />
                <h3 className="text-xl font-bold flex items-center"><Crown className="h-6 w-6 mr-2" /> Premium</h3>
                <p className="text-yellow-100 text-sm mt-1">Active Membership</p>
             </div>
        ) : (
             <div 
               onClick={onShowPaywall}
               className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer group border border-slate-700 hover:border-emerald-500/50 transition-all"
             >
                <Lock className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-700 group-hover:text-emerald-500/20 transition-colors rotate-12" />
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                         <div>
                             <h3 className="text-xl font-bold flex items-center mb-1">
                                {t('premiumTitle')}
                                {user?.subscriptionStatus === 'trial' && <span className="ml-2 text-xs bg-emerald-500 px-2 py-0.5 rounded-full">{t('trialActive')}</span>}
                             </h3>
                             <p className="text-slate-400 text-sm">{t('premiumDesc')}</p>
                         </div>
                         <Crown className="text-yellow-400 h-6 w-6" />
                    </div>
                </div>
             </div>
        )}

        {/* Theme */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center">
             <Sun className="h-4 w-4 mr-2" /> {t('appearance')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={() => onThemeChange('light')}
                className={`p-4 rounded-2xl border flex items-center justify-center space-x-2 transition-all ${currentTheme === 'light' ? 'bg-slate-100 border-emerald-500 text-slate-900 ring-2 ring-emerald-500/20' : 'bg-transparent border-slate-200 text-slate-500 dark:border-slate-700'}`}
             >
                <Sun className="h-5 w-5" /> <span className="font-medium">{t('lightMode')}</span>
             </button>
             <button 
                onClick={() => onThemeChange('dark')}
                className={`p-4 rounded-2xl border flex items-center justify-center space-x-2 transition-all ${currentTheme === 'dark' ? 'bg-slate-800 border-emerald-500 text-white ring-2 ring-emerald-500/20' : 'bg-transparent border-slate-200 text-slate-500 dark:border-slate-700'}`}
             >
                <Moon className="h-5 w-5" /> <span className="font-medium">{t('darkMode')}</span>
             </button>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center">
             <Globe className="h-4 w-4 mr-2" /> {t('language')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
             <button 
                onClick={() => onLangChange('en')}
                className={`p-4 rounded-2xl border flex items-center justify-center space-x-2 transition-all ${currentLang === 'en' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold ring-2 ring-emerald-500/20' : 'bg-transparent border-slate-200 text-slate-500 dark:border-slate-700'}`}
             >
                <span className="text-xl mr-2">🇺🇸</span>
                <span>English</span>
             </button>
             <button 
                onClick={() => onLangChange('pt')}
                className={`p-4 rounded-2xl border flex items-center justify-center space-x-2 transition-all ${currentLang === 'pt' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold ring-2 ring-emerald-500/20' : 'bg-transparent border-slate-200 text-slate-500 dark:border-slate-700'}`}
             >
                <span className="text-xl mr-2">🇧🇷</span>
                <span>Português</span>
             </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
           <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center">
                 {t('categories')}
               </h3>
               {user?.subscriptionStatus === 'free' && (
                   <span className="text-xs text-orange-500 font-medium">Free Limit Applied</span>
               )}
           </div>
           
          <div className="flex space-x-2 mb-4">
             <input 
                type="text" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder={t('addCategory')}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 text-slate-900 dark:text-white transition-colors"
             />
             <button 
                onClick={handleAddCategory}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl shadow-lg shadow-emerald-500/30"
             >
                <Plus className="h-6 w-6" />
             </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
             {categories.map(cat => (
                <div key={cat} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 group">
                    {editingCategory === cat ? (
                        <div className="flex items-center flex-1 space-x-2">
                             <input 
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 bg-white dark:bg-slate-900 border border-emerald-500 rounded px-2 py-1 text-sm dark:text-white"
                                autoFocus
                             />
                             <button onClick={saveEdit} className="text-emerald-500 hover:text-emerald-600">
                                <Check className="h-4 w-4" />
                             </button>
                        </div>
                    ) : (
                        <>
                            <span className="text-slate-700 dark:text-slate-200 font-medium">{cat}</span>
                            <div className="flex items-center space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEditing(cat)} className="text-slate-400 hover:text-emerald-500 p-2">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDeleteCategory(cat)} className="text-slate-400 hover:text-red-500 p-2">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
             ))}
          </div>
        </div>

        {/* Logout */}
        <button 
            onClick={onLogout}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-4 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center space-x-2"
        >
            <LogOut className="h-5 w-5" />
            <span>{t('logout')}</span>
        </button>

      </div>
    </div>
  );
};