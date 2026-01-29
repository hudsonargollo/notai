import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Globe, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  LogOut, 
  Crown, 
  Lock 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Theme, Language, UserProfile } from '../types';
import { useTranslation } from '../utils/i18n';
import { 
  getCategories, 
  saveCategories, 
  updateCategoryName, 
  getUserProfile, 
  canAddCategory 
} from '../services/expenseService';
import { scaleOnHover, slideFromBottom } from '../src/lib/animations';

// Shadcn/UI Components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../src/components/ui/sheet';
import { Input } from '../src/components/ui/input';
import { Label } from '../src/components/ui/label';
import { Button } from '../src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../src/components/ui/form';

// Zod schema for category form validation
const categoryFormSchema = z.object({
  categoryName: z.string()
    .min(1, 'Category name cannot be empty')
    .max(50, 'Category name is too long')
    .refine((val) => val.trim().length > 0, 'Category name cannot be empty'),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

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
  const [isOpen, setIsOpen] = useState(true);
  
  // Edit State
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // React Hook Form for category management
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: '',
    },
  });

  useEffect(() => {
    // Reload categories when component mounts
    setCategories(getCategories());
  }, []);

  const handleAddCategory = (values: CategoryFormValues) => {
    const categoryName = values.categoryName.trim();

    // Validate category limit
    if (!canAddCategory()) {
      form.setError('categoryName', {
        type: 'manual',
        message: t('catLimitReached'),
      });
      return;
    }

    // Validate duplicate
    if (categories.includes(categoryName)) {
      form.setError('categoryName', {
        type: 'manual',
        message: 'Category already exists',
      });
      return;
    }

    // Add category
    const updated = [...categories, categoryName];
    setCategories(updated);
    saveCategories(updated);
    form.reset();
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

  const handleClose = () => {
    setIsOpen(false);
    // Delay actual close to allow animation to complete
    setTimeout(onClose, 300);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg overflow-y-auto p-0"
        aria-describedby="settings-description"
      >
        {/* Header */}
        <SheetHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-md px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleClose} 
              className="p-2 -ml-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Close settings"
            >
              <ArrowLeft className="h-6 w-6" strokeWidth={2} />
            </button>
            <SheetTitle className="text-lg font-bold">{t('profile')}</SheetTitle>
            <div className="w-8"></div>
          </div>
        </SheetHeader>

        <p id="settings-description" className="sr-only">
          Manage your profile settings, theme, language, and expense categories
        </p>

        <motion.div 
          className="p-6 pb-24 space-y-8"
          variants={slideFromBottom}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Subscription Banner */}
          {user?.subscriptionStatus === 'premium' ? (
            <motion.div 
              className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Crown className="absolute -right-4 -bottom-4 h-24 w-24 opacity-20 rotate-12" strokeWidth={2} />
              <h3 className="text-xl font-bold flex items-center">
                <Crown className="h-6 w-6 mr-2" strokeWidth={2} /> Premium
              </h3>
              <p className="text-yellow-100 text-sm mt-1">Active Membership</p>
            </motion.div>
          ) : (
            <motion.div 
              onClick={onShowPaywall}
              className="bg-card rounded-3xl p-6 shadow-lg relative overflow-hidden cursor-pointer group border border-border hover:border-emerald-500/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Lock className="absolute -right-4 -bottom-4 h-24 w-24 text-muted-foreground/20 group-hover:text-emerald-500/20 transition-colors rotate-12" strokeWidth={2} />
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold flex items-center mb-1">
                      {t('premiumTitle')}
                      {user?.subscriptionStatus === 'trial' && (
                        <span className="ml-2 text-xs bg-emerald-500 px-2 py-0.5 rounded-full">
                          {t('trialActive')}
                        </span>
                      )}
                    </h3>
                    <p className="text-muted-foreground text-sm">{t('premiumDesc')}</p>
                  </div>
                  <Crown className="text-yellow-400 h-6 w-6" strokeWidth={2} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Theme */}
          <div className="bg-card p-6 rounded-3xl border shadow-sm">
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-4 flex items-center">
              <Sun className="h-4 w-4 mr-2" strokeWidth={2} /> {t('appearance')}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
                <Button
                  onClick={() => onThemeChange('light')}
                  variant={currentTheme === 'light' ? 'default' : 'outline'}
                  className="w-full h-auto p-4 flex items-center justify-center space-x-2"
                  aria-pressed={currentTheme === 'light'}
                >
                  <Sun className="h-4 w-4" strokeWidth={2} />
                  <span className="font-medium">{t('lightMode')}</span>
                </Button>
              </motion.div>
              <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
                <Button
                  onClick={() => onThemeChange('dark')}
                  variant={currentTheme === 'dark' ? 'default' : 'outline'}
                  className="w-full h-auto p-4 flex items-center justify-center space-x-2"
                  aria-pressed={currentTheme === 'dark'}
                >
                  <Moon className="h-4 w-4" strokeWidth={2} />
                  <span className="font-medium">{t('darkMode')}</span>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-card p-6 rounded-3xl border shadow-sm">
            <Label className="text-xs font-bold text-muted-foreground uppercase mb-4 flex items-center">
              <Globe className="h-4 w-4 mr-2" strokeWidth={2} /> {t('language')}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
                <Button
                  onClick={() => onLangChange('en')}
                  variant={currentLang === 'en' ? 'default' : 'outline'}
                  className="w-full h-auto p-4 flex items-center justify-center space-x-2"
                  aria-pressed={currentLang === 'en'}
                >
                  <span className="text-xl mr-2">🇺🇸</span>
                  <span>English</span>
                </Button>
              </motion.div>
              <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
                <Button
                  onClick={() => onLangChange('pt')}
                  variant={currentLang === 'pt' ? 'default' : 'outline'}
                  className="w-full h-auto p-4 flex items-center justify-center space-x-2"
                  aria-pressed={currentLang === 'pt'}
                >
                  <span className="text-xl mr-2">🇧🇷</span>
                  <span>Português</span>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-card p-6 rounded-3xl border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center">
                {t('categories')}
              </Label>
              {user?.subscriptionStatus === 'free' && (
                <span className="text-xs text-orange-500 font-medium">
                  Free Limit Applied
                </span>
              )}
            </div>
            
            {/* Add Category Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddCategory)} className="space-y-2 mb-4">
                <div className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="categoryName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t('addCategory')}
                            aria-label="New category name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-10 w-10"
                      aria-label="Add category"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </motion.div>
                </div>
              </form>
            </Form>

            {/* Categories List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <motion.div
                  key={cat}
                  className="flex justify-between items-center bg-accent/50 p-4 rounded-2xl border group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {editingCategory === cat ? (
                    <div className="flex items-center flex-1 space-x-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 h-8"
                        autoFocus
                        aria-label={`Edit category ${cat}`}
                      />
                      <Button
                        onClick={saveEdit}
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-emerald-500 hover:text-emerald-600"
                        aria-label="Save category name"
                      >
                        <Check className="h-4 w-4" strokeWidth={2} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{cat}</span>
                      <div className="flex items-center space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => startEditing(cat)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-emerald-500"
                          aria-label={`Edit category ${cat}`}
                        >
                          <Edit2 className="h-4 w-4" strokeWidth={2} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCategory(cat)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          aria-label={`Delete category ${cat}`}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
            <Button
              onClick={onLogout}
              variant="destructive"
              className="w-full h-auto py-4 flex items-center justify-center space-x-2"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              <span className="font-bold">{t('logout')}</span>
            </Button>
          </motion.div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};
