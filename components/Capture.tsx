import React, { useEffect, useRef, useState } from 'react';
import { X, Image as ImageIcon, ChevronDown, ChevronRight, Plus, Trash2, Camera as CameraIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIReceiptResponse, Expense, LineItem, RecurrenceFrequency, Language } from '../types';
import { parseReceiptImage } from '../services/geminiService';
import { addExpense, updateExpense, getCategories, incrementAIInteraction } from '../services/expenseService';
import { useTranslation } from '../utils/i18n';

type Stage = 'viewfinder' | 'processing' | 'review';

interface CaptureProps {
  initialExpense?: Expense;
  onSaveComplete: (savedExpense: Expense) => void;
  onCancel: () => void;
  onShowPaywall: () => void;
  currentLang: Language;
}

const format = (str: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), str);

const todayISO = () => new Date().toISOString().split('T')[0];

const emptyReceipt: AIReceiptResponse = {
  merchant_name: '',
  transaction_date: todayISO(),
  total_amount: 0,
  currency: 'BRL',
  category: 'Other',
  line_items: [],
  summary_note: '',
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const Capture: React.FC<CaptureProps> = ({ initialExpense, onSaveComplete, onCancel, onShowPaywall, currentLang }) => {
  const t = useTranslation(currentLang);
  const locale = currentLang === 'pt' ? 'pt-BR' : 'en-US';

  const [stage, setStage] = useState<Stage>(initialExpense ? 'review' : 'viewfinder');
  const [categories, setCategories] = useState<string[]>(getCategories());
  const [cameraError, setCameraError] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<{ file: File; imageUrl: string } | null>(null);

  // --- editable fields ---
  const [capturedImage, setCapturedImage] = useState<string | null>(initialExpense?.receipt_image_url || null);
  const [aiSuggested, setAiSuggested] = useState(false);
  const [merchant, setMerchant] = useState(initialExpense?.merchant_name || '');
  const [amount, setAmount] = useState(initialExpense?.amount || 0);
  const [isAmountEditable, setIsAmountEditable] = useState(false);
  const [date, setDate] = useState(initialExpense?.date || todayISO());
  const [category, setCategory] = useState(initialExpense?.category || 'Other');
  const [lineItems, setLineItems] = useState<LineItem[]>(initialExpense?.line_items || []);
  const [showLineItems, setShowLineItems] = useState(false);
  const [isRecurring, setIsRecurring] = useState(!!initialExpense?.is_recurring);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency>(
    initialExpense?.recurrence_frequency || 'Monthly'
  );
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(initialExpense?.recurrence_end_date || '');
  const [aiSummary, setAiSummary] = useState(initialExpense?.ai_summary || '');

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  // --- camera lifecycle: live preview while in the viewfinder stage ---
  useEffect(() => {
    if (stage !== 'viewfinder') return;
    let cancelled = false;

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(true);
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCameraError(true));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    };
  }, [stage]);

  const applyParsedData = (data: AIReceiptResponse) => {
    setMerchant(data.merchant_name || '');
    setAmount(data.total_amount || 0);
    setDate(data.transaction_date || todayISO());
    setCategory(data.category || categories[0] || 'Other');
    setLineItems(data.line_items || []);
    setAiSummary(data.summary_note || '');
  };

  const runOcr = async (file: File, imageUrl: string) => {
    pendingFileRef.current = { file, imageUrl };
    setCapturedImage(imageUrl);
    setStage('processing');
    setProcessingError(null);
    try {
      const activeCategories = categories.length ? categories : getCategories();
      const { data } = await parseReceiptImage(file, activeCategories, currentLang);
      applyParsedData(data);
      setAiSuggested(true);
      setStage('review');
    } catch (err) {
      console.error(err);
      setProcessingError(t('errorScanReceipt'));
    }
  };

  const handleShutter = () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1080;
    canvas.height = video.videoHeight || 1440;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL('image/jpeg', 0.85);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        runOcr(new File([blob], 'receipt.jpg', { type: 'image/jpeg' }), imageUrl);
      },
      'image/jpeg',
      0.85
    );
  };

  const handleFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => runOcr(file, ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleManual = () => {
    applyParsedData(emptyReceipt);
    setAiSuggested(false);
    setCapturedImage(null);
    pendingFileRef.current = null;
    setProcessingError(null);
    setStage('review');
  };

  const handleRetry = () => {
    setProcessingError(null);
    setCapturedImage(null);
    pendingFileRef.current = null;
    setStage('viewfinder');
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setLineItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeItem = (index: number) => setLineItems((prev) => prev.filter((_, i) => i !== index));
  const addItem = () => setLineItems((prev) => [...prev, { item: '', price: 0, quantity: 1 }]);

  const handleSave = () => {
    const baseData = {
      merchant_name: merchant,
      amount,
      date,
      category,
      currency: 'BRL',
      receipt_image_url: capturedImage || undefined,
      ai_summary: aiSummary,
      line_items: lineItems,
      is_recurring: isRecurring,
      recurrence_frequency: isRecurring ? recurrenceFrequency : undefined,
      recurrence_end_date: isRecurring ? recurrenceEndDate || undefined : undefined,
    };

    let saved: Expense;
    if (initialExpense) {
      saved = updateExpense({ ...initialExpense, ...baseData });
    } else {
      saved = addExpense(baseData);
      if (!incrementAIInteraction()) onShowPaywall();
    }
    onSaveComplete(saved);
  };

  const formatAmount = (n: number) =>
    `R$ ${n.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // ------------------------------------------------------------------
  // State A — Viewfinder (always dark chrome)
  // ------------------------------------------------------------------
  if (stage === 'viewfinder') {
    return (
      <div className="h-full w-full relative bg-[#0b0b0a] overflow-hidden" data-theme="dark">
        {!cameraError ? (
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="absolute inset-0 h-full w-full flex flex-col items-center justify-center gap-4 text-white"
          >
            <CameraIcon className="h-10 w-10 text-white/70" strokeWidth={2} />
            <p className="text-[15px] text-white/80 max-w-[220px] text-center">{t('captureCameraFallback')}</p>
          </button>
        )}

        {/* corner guides */}
        <div className="pointer-events-none absolute inset-6 top-24 bottom-40">
          {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
            <span
              key={corner}
              className={`absolute h-8 w-8 border-white/70 ${
                corner === 'top-left'
                  ? 'top-0 left-0 border-l-[2.5px] border-t-[2.5px] rounded-tl-[24px]'
                  : corner === 'top-right'
                  ? 'top-0 right-0 border-r-[2.5px] border-t-[2.5px] rounded-tr-[24px]'
                  : corner === 'bottom-left'
                  ? 'bottom-0 left-0 border-l-[2.5px] border-b-[2.5px] rounded-bl-[24px]'
                  : 'bottom-0 right-0 border-r-[2.5px] border-b-[2.5px] rounded-br-[24px]'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onCancel}
          aria-label={t('captureCloseAria')}
          className="absolute top-5 left-5 w-11 h-11 rounded-full bg-black/30 flex items-center justify-center text-white"
        >
          <X className="h-6 w-6" strokeWidth={2.5} />
        </button>

        <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-pill bg-black/40 text-white text-[13px]">
          {t('captureHint')}
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-6 flex items-center justify-between px-8">
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            aria-label={t('uploadGallery')}
            className="w-11 h-11 rounded-thumb bg-white/15 flex items-center justify-center text-white"
          >
            <ImageIcon className="h-5 w-5" strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={cameraError ? () => cameraInputRef.current?.click() : handleShutter}
            aria-label={t('captureShutterAria')}
            className="w-[72px] h-[72px] rounded-full border-[3px] border-white bg-transparent"
          />

          <button
            type="button"
            onClick={handleManual}
            className="text-white/80 text-[13px] font-semibold min-w-[44px] min-h-[44px]"
          >
            {t('captureManual')}
          </button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChosen}
        />
        <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChosen} />
      </div>
    );
  }

  // ------------------------------------------------------------------
  // State B — Processing (inline, same mounted screen)
  // ------------------------------------------------------------------
  if (stage === 'processing') {
    return (
      <div className="h-full w-full relative bg-[#0b0b0a]" data-theme="dark">
        {capturedImage && (
          <img src={capturedImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
          {!processingError ? (
            <>
              <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <p className="text-white text-[15px]">{t('captureProcessing')}</p>
            </>
          ) : (
            <>
              <p className="text-white text-[15px]">{processingError}</p>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-5 h-11 rounded-pill bg-white/15 text-white text-[14px] font-semibold"
                >
                  {t('captureRetry')}
                </button>
                <button
                  type="button"
                  onClick={handleManual}
                  className="px-5 h-11 rounded-pill bg-white text-[#0b0b0a] text-[14px] font-semibold"
                >
                  {t('captureManualEntry')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // State C — Review (full sheet, editable)
  // ------------------------------------------------------------------
  const motionProps = prefersReducedMotion()
    ? {}
    : { initial: { y: 24, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.28, ease: 'easeOut' as const } };

  return (
    <motion.div {...motionProps} className="h-full w-full flex flex-col bg-bg">
      <div className="flex items-center justify-between px-5 pt-5">
        <button
          type="button"
          onClick={onCancel}
          aria-label={t('captureCloseAria')}
          className="w-11 h-11 rounded-full bg-surface-2 flex items-center justify-center text-text"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <div className="w-11" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-28 space-y-6">
        {/* Amount */}
        <div className="text-center pt-2">
          {isAmountEditable ? (
            <input
              type="number"
              step="0.01"
              autoFocus
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              onBlur={() => setIsAmountEditable(false)}
              className="font-display text-[40px] leading-[1.1] text-text bg-transparent text-center w-56 outline-none border-b-2 border-accent"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsAmountEditable(true)}
              className="font-display text-[40px] leading-[1.1] text-text tabular-nums"
            >
              {formatAmount(amount)}
            </button>
          )}
        </div>

        {/* Receipt thumb + merchant */}
        <div className="flex items-center gap-3">
          {capturedImage && (
            <button type="button" onClick={() => setShowFullImage(true)} className="flex-shrink-0">
              <img src={capturedImage} alt="" className="w-14 h-14 rounded-thumb object-cover" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <label className="text-[11px] font-semibold text-muted">{t('merchant')}</label>
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full text-[15px] font-semibold text-text bg-surface-2 rounded-input px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-[11px] font-semibold text-muted">{t('date')}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-[15px] font-semibold text-text bg-surface-2 rounded-input px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Category chips */}
        <div>
          <label className="text-[11px] font-semibold text-muted">{t('category')}</label>
          <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setAiSuggested(false);
                }}
                className={`flex-shrink-0 px-4 h-11 rounded-pill text-[13px] font-semibold ${
                  category === cat ? 'bg-accent text-white' : 'bg-surface-2 text-text'
                }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>
          {aiSuggested && <p className="text-[11px] text-muted mt-1">{t('captureSuggested')}</p>}
        </div>

        {/* Line items */}
        {lineItems.length > 0 && (
          <div className="bg-surface rounded-card">
            <button
              type="button"
              onClick={() => setShowLineItems((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 min-h-[44px]"
            >
              <span className="text-[13px] font-semibold text-text">{format(t('lineItemsRow'), { n: lineItems.length })}</span>
              {showLineItems ? (
                <ChevronDown className="h-4 w-4 text-muted" strokeWidth={2.5} />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted" strokeWidth={2.5} />
              )}
            </button>
            {showLineItems && (
              <div className="px-4 pb-4 space-y-2">
                {lineItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={item.item}
                      onChange={(e) => handleItemChange(idx, 'item', e.target.value)}
                      placeholder={t('itemName')}
                      className="flex-1 min-w-0 text-[13px] bg-surface-2 rounded-input px-3 py-2 outline-none"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value) || 0)}
                      placeholder={t('qty')}
                      className="w-14 text-[13px] bg-surface-2 rounded-input px-2 py-2 outline-none tabular-nums"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)}
                      placeholder={t('price')}
                      className="w-20 text-[13px] bg-surface-2 rounded-input px-2 py-2 outline-none tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      aria-label={t('delete')}
                      className="w-11 h-11 flex items-center justify-center text-danger flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-accent-deep min-h-[44px]"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} /> {t('addItem')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recurring */}
        <div className="bg-surface rounded-card px-4 py-3">
          <div className="flex items-center justify-between min-h-[44px]">
            <span className="text-[15px] font-semibold text-text">{t('captureRecurring')}</span>
            <button
              type="button"
              role="switch"
              aria-checked={isRecurring}
              onClick={() => setIsRecurring((v) => !v)}
              className={`relative w-12 h-7 rounded-pill px-1 transition-colors ${
                isRecurring ? 'bg-accent' : 'bg-surface-2'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-elevated transition-transform ${
                  isRecurring ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {isRecurring && (
            <div className="mt-3 space-y-3">
              <div className="flex gap-2">
                {(['Weekly', 'Monthly', 'Yearly'] as RecurrenceFrequency[]).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setRecurrenceFrequency(freq)}
                    className={`px-4 h-11 rounded-pill text-[13px] font-semibold ${
                      recurrenceFrequency === freq ? 'bg-accent text-white' : 'bg-surface-2 text-text'
                    }`}
                  >
                    {t(freq.toLowerCase())}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted">{t('endDate')}</label>
                <input
                  type="date"
                  value={recurrenceEndDate}
                  onChange={(e) => setRecurrenceEndDate(e.target.value)}
                  className="w-full text-[15px] font-semibold text-text bg-surface-2 rounded-input px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 px-5 pb-6 pt-4 bg-bg">
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-[52px] rounded-pill bg-accent text-white font-sans font-bold text-[16px]"
        >
          {t('reviewSave')}
        </button>
      </div>

      {showFullImage && capturedImage && (
        <button
          type="button"
          onClick={() => setShowFullImage(false)}
          className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
        >
          <img src={capturedImage} alt="" className="max-h-full max-w-full object-contain rounded-card" />
        </button>
      )}
    </motion.div>
  );
};
