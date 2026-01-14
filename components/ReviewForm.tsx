import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Calendar, Tag, Store, ChevronDown, ChevronUp, Plus, Trash2, Edit2, Download, Maximize2, X } from 'lucide-react';
import { AIReceiptResponse, Expense, RecurrenceFrequency, Language, LineItem } from '../types';
import { addExpense, updateExpense, getCategories } from '../services/expenseService';
import { useTranslation } from '../utils/i18n';

interface ReviewFormProps {
  initialData: AIReceiptResponse | Expense; 
  imageUrl?: string;
  onSave: () => void;
  onCancel: () => void;
  currentLang: Language;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ initialData, imageUrl, onSave, onCancel, currentLang }) => {
  const isExisting = (data: any): data is Expense => 'id' in data;
  const existingId = isExisting(initialData) ? initialData.id : undefined;
  const t = useTranslation(currentLang);
  
  const [categories, setCategories] = useState<string[]>([]);
  const [showLineItems, setShowLineItems] = useState(false);
  const [isAmountEditable, setIsAmountEditable] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const [formData, setFormData] = useState({
    merchant_name: initialData.merchant_name || '',
    amount: isExisting(initialData) ? initialData.amount : (initialData as AIReceiptResponse).total_amount || 0,
    date: isExisting(initialData) ? initialData.date : (initialData as AIReceiptResponse).transaction_date || new Date().toISOString().split('T')[0],
    category: initialData.category || 'Other',
    ai_summary: isExisting(initialData) ? initialData.ai_summary : (initialData as AIReceiptResponse).summary_note || '',
    is_recurring: isExisting(initialData) ? initialData.is_recurring : false,
    recurrence_frequency: isExisting(initialData) ? initialData.recurrence_frequency : 'Monthly' as RecurrenceFrequency,
    recurrence_end_date: isExisting(initialData) ? initialData.recurrence_end_date : '',
    line_items: initialData.line_items || [] as LineItem[]
  });

  const displayImage = imageUrl || (isExisting(initialData) ? initialData.receipt_image_url : undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = imageUrl || (isExisting(initialData) ? initialData.receipt_image_url : undefined);
    const baseData = {
      ...formData,
      currency: 'BRL',
      receipt_image_url: finalImageUrl, 
    };

    if (existingId) {
        updateExpense({
            ...baseData,
            id: existingId,
            user_id: (initialData as Expense).user_id,
            created_at: (initialData as Expense).created_at
        });
    } else {
        addExpense(baseData);
    }
    onSave();
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedItems = [...formData.line_items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData({ ...formData, line_items: updatedItems });
  };

  const removeItem = (index: number) => {
    const updatedItems = formData.line_items.filter((_, i) => i !== index);
    setFormData({ ...formData, line_items: updatedItems });
  };

  const addItem = () => {
    setFormData({
        ...formData,
        line_items: [...formData.line_items, { item: '', price: 0, quantity: 1 }]
    });
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <header className="px-8 pt-8 pb-4 flex items-center justify-between z-10 flex-shrink-0">
        <button onClick={onCancel} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="font-black text-xl text-white tracking-tight">{existingId ? 'Editar' : 'Revisar'}</h1>
        <div className="w-14" /> 
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden px-8 pb-8">
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-20">
          
          <div className="text-center pt-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Valor Extraído</p>
            <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-black text-slate-500">R$</span>
                {isAmountEditable ? (
                    <input
                        type="number"
                        step="0.01"
                        autoFocus
                        onBlur={() => setIsAmountEditable(false)}
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                        className="text-5xl font-black text-white bg-transparent text-center w-48 outline-none border-b-2 border-emerald-500"
                    />
                ) : (
                    <div onClick={() => setIsAmountEditable(true)} className="text-5xl font-black text-white cursor-pointer flex items-center">
                        {formData.amount.toFixed(2)}
                        <Edit2 className="ml-3 h-5 w-5 text-slate-600" />
                    </div>
                )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Local</label>
              <input type="text" required value={formData.merchant_name} onChange={(e) => setFormData({...formData, merchant_name: e.target.value})} className="w-full text-xl font-bold text-white bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-energy-500 outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Data</label>
              <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full text-lg font-bold text-white bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-energy-500 outline-none" />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setFormData({...formData, category: cat})}
                    className={`text-xs font-black py-2.5 px-4 rounded-xl border transition-all ${
                      formData.category === cat ? 'bg-energy-500 text-white border-energy-500 shadow-lg shadow-energy-500/20' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {t(cat)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-8 right-8 z-20">
          <button type="submit" className="w-full bg-white text-slate-950 font-black text-xl py-6 rounded-full shadow-2xl active:scale-95 transition-all flex items-center justify-center">
            <Save className="mr-3 h-6 w-6" />
            Salvar Registro
          </button>
        </div>
      </form>
    </div>
  );
};