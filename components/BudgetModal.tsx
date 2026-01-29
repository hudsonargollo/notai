import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Budget, Language } from '../types';
import { saveBudget, getBudgets, getCategories } from '../services/expenseService';
import { useTranslation } from '../utils/i18n';
import { useIsMobile } from '../src/hooks/useMediaQuery';
import { scaleOnHover, modalAnimation } from '../src/lib/animations';

// Shadcn/UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../src/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../src/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../src/components/ui/select';
import { Input } from '../src/components/ui/input';
import { Label } from '../src/components/ui/label';
import { Button } from '../src/components/ui/button';

interface BudgetModalProps {
  onClose: () => void;
  onSave: () => void;
  currentLang: Language;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ onClose, onSave, currentLang }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [existingBudgets, setExistingBudgets] = useState<Budget[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const t = useTranslation(currentLang);
  const isMobile = useIsMobile();

  useEffect(() => {
    const cats = getCategories();
    setCategories(cats);
    if (cats.length > 0) setSelectedCategory(cats[0]);

    const budgets = getBudgets();
    setExistingBudgets(budgets);
    const current = budgets.find(b => b.category === cats[0]);
    if (current) setAmount(current.amount.toString());
  }, []);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const saved = existingBudgets.find(b => b.category === cat);
    setAmount(saved ? saved.amount.toString() : '0');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      saveBudget({ category: selectedCategory, amount: parseFloat(amount) });
      onSave();
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Delay actual close to allow animation to complete
    setTimeout(onClose, 200);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  // Form content component (shared between Dialog and Sheet)
  const FormContent = () => (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={modalAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="space-y-2">
        <Label htmlFor="category" className="text-xs font-bold uppercase">
          {t('category')}
        </Label>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger
            id="category"
            className="w-full"
            aria-label={t('category')}
          >
            <SelectValue placeholder={t('category')} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {t(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-xs font-bold uppercase">
          {t('totalAmount')}
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
            $
          </span>
          <Input
            id="amount"
            type="number"
            min="0"
            step="10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-8 font-bold text-lg"
            aria-label={t('totalAmount')}
            aria-describedby="amount-description"
          />
        </div>
        <p id="amount-description" className="sr-only">
          Enter the budget amount for the selected category
        </p>
      </div>

      <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          aria-label={`${t('save')} budget`}
        >
          <Save className="h-4 w-4 mr-2" strokeWidth={2} />
          {t('save')}
        </Button>
      </motion.div>
    </motion.form>
  );

  // Render Sheet for mobile, Dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl"
          aria-describedby="budget-sheet-description"
        >
          <SheetHeader>
            <SheetTitle>{t('monthlyBudgets')}</SheetTitle>
          </SheetHeader>
          <p id="budget-sheet-description" className="sr-only">
            Set monthly budgets for different expense categories
          </p>
          {/* Visual handle indicator for mobile */}
          <div className="mx-auto w-12 h-1.5 rounded-full bg-muted mb-4" />
          <FormContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        aria-describedby="budget-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>{t('monthlyBudgets')}</DialogTitle>
        </DialogHeader>
        <p id="budget-dialog-description" className="sr-only">
          Set monthly budgets for different expense categories
        </p>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};
