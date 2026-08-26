import React, { useMemo, useState } from 'react';
import { ChevronRight, Plus, Pencil, Trash2, Check, X, Download, LogOut } from 'lucide-react';
import { useTranslation } from '../utils/i18n';
import { Language, Theme, UserProfile } from '../types';
import {
  getCategories,
  saveCategories,
  updateCategoryName,
  canAddCategory,
  getExpenses,
} from '../services/expenseService';
import { clearAllData } from '../services/expenseService';

interface SettingsProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  user: UserProfile | null;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
  onShowPaywall: () => void;
}

const format = (str: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), str);

const FREE_CAPTURE_LIMIT = 40;

const Segmented: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="flex bg-surface-2 rounded-pill p-1 gap-1">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`flex-1 min-h-[40px] rounded-pill text-[13px] font-semibold transition-colors ${
          value === opt.value ? 'bg-accent text-white' : 'text-muted'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-surface rounded-card p-5">
    <h2 className="text-[13px] font-semibold text-muted mb-4">{title}</h2>
    {children}
  </div>
);

const ConfirmSheet: React.FC<{
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ title, body, confirmLabel, cancelLabel, onConfirm, onCancel }) => (
  <div className="absolute inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
    <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
    <div className="relative w-full max-w-lg bg-surface rounded-t-sheet p-6 shadow-elevated">
      <div className="w-9 h-1 rounded-pill bg-border mx-auto mb-4" />
      <h3 className="font-display text-[20px] text-text mb-2">{title}</h3>
      <p className="text-[15px] text-muted mb-6">{body}</p>
      <button
        onClick={onConfirm}
        className="w-full h-[52px] rounded-pill bg-danger text-white font-bold text-[16px] mb-2"
      >
        {confirmLabel}
      </button>
      <button onClick={onCancel} className="w-full h-[52px] rounded-pill text-accent-deep font-bold text-[16px]">
        {cancelLabel}
      </button>
    </div>
  </div>
);

export const Settings: React.FC<SettingsProps> = ({
  currentLang,
  onLangChange,
  theme,
  onThemeChange,
  user,
  onUpdateUser,
  onLogout,
  onShowPaywall,
}) => {
  const t = useTranslation(currentLang);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || '');

  const [categories, setCategories] = useState<string[]>(() => getCategories());
  const [newCategory, setNewCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryValue, setEditCategoryValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const saveName = () => {
    const trimmed = nameValue.trim();
    if (trimmed) onUpdateUser({ name: trimmed });
    setEditingName(false);
  };

  const addCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    if (!canAddCategory()) {
      setCategoryError(t('catLimitReached'));
      return;
    }
    if (categories.includes(name)) {
      setCategoryError(t('catLimitReached'));
      return;
    }
    const updated = [...categories, name];
    setCategories(updated);
    saveCategories(updated);
    setNewCategory('');
    setCategoryError('');
  };

  const startEditCategory = (cat: string) => {
    setEditingCategory(cat);
    setEditCategoryValue(t(cat));
  };

  const saveEditCategory = () => {
    if (editingCategory && editCategoryValue.trim() && editCategoryValue !== editingCategory) {
      updateCategoryName(editingCategory, editCategoryValue.trim());
      setCategories(getCategories());
    }
    setEditingCategory(null);
  };

  const confirmDeleteCategory = () => {
    if (!deleteTarget) return;
    const updated = categories.filter((c) => c !== deleteTarget);
    setCategories(updated);
    saveCategories(updated);
    setDeleteTarget(null);
  };

  const handleExportCsv = () => {
    const expenses = getExpenses();
    const header = ['date', 'merchant_name', 'category', 'amount', 'currency', 'ai_summary'];
    const rows = expenses.map((e) =>
      [e.date, e.merchant_name, e.category, e.amount, e.currency, e.ai_summary]
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notai-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllData = () => {
    clearAllData();
    setCategories(getCategories());
    setConfirmDeleteAll(false);
  };

  const planLabel = useMemo(() => {
    if (user?.subscriptionStatus === 'premium') return t('settingsPlanPremium');
    if (user?.subscriptionStatus === 'trial') return t('settingsPlanTrial');
    return format(t('settingsPlanFreeUsage'), {
      used: user?.aiInteractionCount ?? 0,
      total: FREE_CAPTURE_LIMIT,
    });
  }, [user, t]);

  const usagePct =
    user?.subscriptionStatus === 'free'
      ? Math.min(100, Math.round(((user?.aiInteractionCount ?? 0) / FREE_CAPTURE_LIMIT) * 100))
      : 100;

  const initials = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-bg pb-28">
      <div className="px-5 pt-8 pb-2">
        <h1 className="font-display text-[28px] text-text">{t('navSettings')}</h1>
      </div>

      <div className="px-5 mt-4 flex flex-col gap-4">
        {/* Profile */}
        <SectionCard title={t('settingsProfile')}>
          {editingName ? (
            <div className="flex items-center gap-3">
              <input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                autoFocus
                className="flex-1 h-[44px] bg-surface-2 rounded-input border border-border px-3 text-[15px] text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button onClick={saveName} aria-label={t('settingsSave')} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-accent-deep">
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <button onClick={() => setEditingName(false)} aria-label={t('cancel')} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted">
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button onClick={() => setEditingName(true)} className="w-full flex items-center gap-3 min-h-[52px]">
              <div className="w-14 h-14 rounded-full bg-accent-soft text-accent-deep flex items-center justify-center font-display text-[20px] flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[15px] font-semibold text-text truncate">{user?.name || t('settingsEditName')}</p>
                <p className="text-[13px] text-muted truncate">{user?.email}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted flex-shrink-0" strokeWidth={2} />
            </button>
          )}
        </SectionCard>

        {/* Preferences */}
        <SectionCard title={t('settingsPreferences')}>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[13px] text-muted mb-2">{t('settingsLanguage')}</p>
              <Segmented
                value={currentLang}
                onChange={(v) => {
                  onLangChange(v as Language);
                  onUpdateUser({ languagePreference: v as Language });
                }}
                options={[
                  { value: 'pt', label: 'Português' },
                  { value: 'en', label: 'English' },
                ]}
              />
            </div>
            <div>
              <p className="text-[13px] text-muted mb-2">{t('settingsCurrency')}</p>
              <div className="h-[44px] flex items-center px-3 bg-surface-2 rounded-input text-[15px] text-text">
                {user?.currencyPreference || 'BRL'}
              </div>
            </div>
            <div>
              <p className="text-[13px] text-muted mb-2">{t('settingsTheme')}</p>
              <Segmented
                value={theme}
                onChange={(v) => {
                  onThemeChange(v as Theme);
                  onUpdateUser({ themePreference: v as Theme });
                }}
                options={[
                  { value: 'system', label: t('settingsThemeSystem') },
                  { value: 'light', label: t('settingsThemeLight') },
                  { value: 'dark', label: t('settingsThemeDark') },
                ]}
              />
            </div>
          </div>
        </SectionCard>

        {/* Categories */}
        <SectionCard title={t('settingsCategories')}>
          <div className="flex gap-2 mb-3">
            <input
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                setCategoryError('');
              }}
              placeholder={t('addCategory')}
              className="flex-1 h-[44px] bg-surface-2 rounded-input border border-border px-3 text-[15px] text-text focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={addCategory}
              aria-label={t('addCategory')}
              className="w-[44px] h-[44px] rounded-input bg-accent text-white flex items-center justify-center flex-shrink-0"
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
          {categoryError && <p className="text-[13px] text-danger mb-3">{categoryError}</p>}

          <div className="flex flex-col divide-y divide-border">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center gap-2 py-3 min-h-[52px]">
                {editingCategory === cat ? (
                  <>
                    <input
                      value={editCategoryValue}
                      onChange={(e) => setEditCategoryValue(e.target.value)}
                      autoFocus
                      className="flex-1 h-[40px] bg-surface-2 rounded-input border border-border px-3 text-[15px] text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button onClick={saveEditCategory} aria-label={t('settingsSave')} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-accent-deep">
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-[15px] text-text">{t(cat)}</span>
                    <button onClick={() => startEditCategory(cat)} aria-label={t('editCategory')} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted">
                      <Pencil className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button onClick={() => setDeleteTarget(cat)} aria-label={t('delete')} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted">
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Plan */}
        <SectionCard title={t('settingsPlan')}>
          <p className="text-[15px] text-text mb-2">{planLabel}</p>
          <div className="h-1.5 rounded-pill bg-surface-2 overflow-hidden mb-3">
            <div className="h-full rounded-pill bg-accent2" style={{ width: `${usagePct}%` }} />
          </div>
          {user?.subscriptionStatus === 'free' && (
            <button onClick={onShowPaywall} className="text-[13px] font-bold text-accent-deep min-h-[44px] -ml-1 px-1">
              {t('settingsUnlockUnlimited')}
            </button>
          )}
        </SectionCard>

        {/* Data */}
        <SectionCard title={t('settingsData')}>
          <button onClick={handleExportCsv} className="w-full flex items-center gap-3 min-h-[52px]">
            <Download className="h-5 w-5 text-muted flex-shrink-0" strokeWidth={2} />
            <span className="flex-1 text-left text-[15px] text-text">{t('settingsExportCsv')}</span>
            <ChevronRight className="h-5 w-5 text-muted flex-shrink-0" strokeWidth={2} />
          </button>
          <button onClick={() => setConfirmDeleteAll(true)} className="w-full flex items-center gap-3 min-h-[52px]">
            <Trash2 className="h-5 w-5 text-danger flex-shrink-0" strokeWidth={2} />
            <span className="flex-1 text-left text-[15px] text-danger">{t('settingsDeleteAllData')}</span>
          </button>
        </SectionCard>

        {/* Sign out */}
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 min-h-[52px] text-danger font-semibold">
          <LogOut className="h-5 w-5" strokeWidth={2} />
          {t('settingsSignOut')}
        </button>

        <p className="text-center text-[11px] text-muted mt-2">
          {format(t('settingsFooterVersion'), { version: '1.0.0' })} · {t('loginTerms')} · {t('loginPrivacy')}
        </p>
      </div>

      {deleteTarget && (
        <ConfirmSheet
          title={t('delete')}
          body={format(t('settingsCategoryDeleteConfirm'), { category: t(deleteTarget) })}
          confirmLabel={t('delete')}
          cancelLabel={t('cancel')}
          onConfirm={confirmDeleteCategory}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {confirmDeleteAll && (
        <ConfirmSheet
          title={t('settingsDeleteAllConfirmTitle')}
          body={t('settingsDeleteAllConfirmBody')}
          confirmLabel={t('settingsDeleteAllConfirmCta')}
          cancelLabel={t('cancel')}
          onConfirm={handleDeleteAllData}
          onCancel={() => setConfirmDeleteAll(false)}
        />
      )}
    </div>
  );
};
