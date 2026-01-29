import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Edit2, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIReceiptResponse, Expense, RecurrenceFrequency, Language, LineItem } from '../types';
import { addExpense, updateExpense, getCategories } from '../services/expenseService';
import { useTranslation } from '../utils/i18n';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Shadcn/UI Components
import { Button } from '../src/components/ui/button';
import { Input } from '../src/components/ui/input';
import { Label } from '../src/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../src/components/ui/form';
import { scaleOnHover } from '../src/lib/animations';

interface ReviewFormProps {
  initialData: AIReceiptResponse | Expense; 
  imageUrl?: string;
  onSave: () => void;
  onCancel: () => void;
  currentLang: Language;
}

// Form validation schema
const reviewFormSchema = z.object({
  merchant_name: z.string().min(1, 'Merchant name is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),
  ai_summary: z.string().optional(),
  is_recurring: z.boolean().optional(),
  recurrence_frequency: z.enum(['Weekly', 'Monthly', 'Yearly']).optional(),
  recurrence_end_date: z.string().optional(),
  line_items: z.array(z.object({
    item: z.string(),
    price: z.number(),
    quantity: z.number(),
  })).optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const ReviewForm: React.FC<ReviewFormProps> = ({ 
  initialData, 
  imageUrl, 
  onSave, 
  onCancel, 
  currentLang 
}) => {
  const isExisting = (data: any): data is Expense => 'id' in data;
  const existingId = isExisting(initialData) ? initialData.id : undefined;
  const t = useTranslation(currentLang);
  
  const [categories, setCategories] = useState<string[]>([]);
  const [showLineItems, setShowLineItems] = useState(false);
  const [isAmountEditable, setIsAmountEditable] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  // Initialize form with react-hook-form
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      merchant_name: initialData.merchant_name || '',
      amount: isExisting(initialData) 
        ? initialData.amount 
        : (initialData as AIReceiptResponse).total_amount || 0,
      date: isExisting(initialData) 
        ? initialData.date 
        : (initialData as AIReceiptResponse).transaction_date || new Date().toISOString().split('T')[0],
      category: initialData.category || 'Other',
      ai_summary: isExisting(initialData) 
        ? initialData.ai_summary 
        : (initialData as AIReceiptResponse).summary_note || '',
      is_recurring: isExisting(initialData) ? initialData.is_recurring : false,
      recurrence_frequency: isExisting(initialData) 
        ? initialData.recurrence_frequency 
        : 'Monthly' as RecurrenceFrequency,
      recurrence_end_date: isExisting(initialData) ? initialData.recurrence_end_date : '',
      line_items: initialData.line_items || [] as LineItem[],
    },
  });

  const displayImage = imageUrl || (isExisting(initialData) ? initialData.receipt_image_url : undefined);

  const handleSubmit = (values: ReviewFormValues) => {
    const finalImageUrl = imageUrl || (isExisting(initialData) ? initialData.receipt_image_url : undefined);
    const baseData = {
      ...values,
      currency: 'BRL',
      receipt_image_url: finalImageUrl,
      ai_summary: values.ai_summary || '',
      line_items: values.line_items || [],
    };

    if (existingId) {
      updateExpense({
        ...baseData,
        id: existingId,
        user_id: (initialData as Expense).user_id,
        created_at: (initialData as Expense).created_at,
      });
    } else {
      addExpense(baseData);
    }
    onSave();
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const currentItems = form.getValues('line_items') || [];
    const updatedItems = [...currentItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    form.setValue('line_items', updatedItems);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues('line_items') || [];
    const updatedItems = currentItems.filter((_, i) => i !== index);
    form.setValue('line_items', updatedItems);
  };

  const addItem = () => {
    const currentItems = form.getValues('line_items') || [];
    form.setValue('line_items', [...currentItems, { item: '', price: 0, quantity: 1 }]);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <header className="px-8 pt-8 pb-4 flex items-center justify-between z-10 flex-shrink-0">
        <Button 
          onClick={onCancel} 
          variant="outline"
          size="icon"
          className="rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2} />
        </Button>
        <h1 className="font-black text-xl text-white tracking-tight">
          {existingId ? 'Editar' : 'Revisar'}
        </h1>
        <div className="w-14" /> 
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 flex flex-col overflow-hidden px-8 pb-8">
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-20">
            
            {/* Amount Display/Edit Section */}
            <div className="text-center pt-4">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">
                Valor Extraído
              </p>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-black text-slate-500">R$</span>
                        {isAmountEditable ? (
                          <Input
                            type="number"
                            step="0.01"
                            autoFocus
                            onBlur={() => setIsAmountEditable(false)}
                            value={field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            className="text-5xl font-black text-white bg-transparent text-center w-48 outline-none border-b-2 border-emerald-500 h-auto p-0"
                          />
                        ) : (
                          <div 
                            onClick={() => setIsAmountEditable(true)} 
                            className="text-5xl font-black text-white cursor-pointer flex items-center"
                          >
                            {field.value.toFixed(2)}
                            <Edit2 className="ml-3 h-4 w-4 text-slate-600" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Fields */}
            <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 space-y-6">
              {/* Merchant Name */}
              <FormField
                control={form.control}
                name="merchant_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Local
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        className="w-full text-xl font-bold text-white bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-energy-500 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Data
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                        className="w-full text-lg font-bold text-white bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-energy-500 outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Categoria
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <Button
                            type="button"
                            key={cat}
                            onClick={() => field.onChange(cat)}
                            variant={field.value === cat ? "default" : "outline"}
                            size="sm"
                            className={`text-xs font-black py-2.5 px-4 rounded-xl transition-all ${
                              field.value === cat 
                                ? 'bg-energy-500 text-white border-energy-500 shadow-lg shadow-energy-500/20' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                            }`}
                          >
                            {t(cat)}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="absolute bottom-10 left-8 right-8 z-20">
            <motion.div whileHover="hover" whileTap="tap" variants={scaleOnHover}>
              <Button 
                type="submit" 
                size="lg"
                className="w-full bg-white text-slate-950 font-black text-xl py-6 rounded-full shadow-2xl hover:bg-white/90"
              >
                <Save className="mr-3 h-6 w-6" strokeWidth={2} />
                Salvar Registro
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </div>
  );
};
