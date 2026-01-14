import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { parseReceiptImage } from '../services/geminiService';
import { AIReceiptResponse, Language, AVATAR_URL } from '../types';
import { getCategories } from '../services/expenseService';
import { useTranslation } from '../utils/i18n';

interface ScannerProps {
  onScanComplete: (data: AIReceiptResponse, imageUrl: string) => void;
  onCancel: () => void;
  currentLang: Language;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete, onCancel, currentLang }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslation(currentLang);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const activeCategories = getCategories();

    try {
      const result = await parseReceiptImage(file, activeCategories, currentLang);
      onScanComplete(result.data, result.imageUrl);
    } catch (err) {
      console.error(err);
      setError(t('errorScan'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-6 overflow-hidden">
      <div className="w-full flex justify-start">
         <button onClick={onCancel} className="p-3 rounded-xl glass-panel text-white">
            <ArrowLeft className="h-5 w-5" />
         </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        {isProcessing ? (
          <div className="flex flex-col items-center animate-pulse">
            <img src={AVATAR_URL} alt="Neo" className="w-32 h-32 object-contain mb-6 animate-float" />
            <h3 className="text-xl font-black text-white">{t('analyzing')}</h3>
            <p className="text-slate-400 text-sm text-center px-4">{t('analyzingDesc')}</p>
          </div>
        ) : (
          <div className="w-full space-y-8">
            <div className="text-center space-y-2">
                <img src={AVATAR_URL} alt="Neo" className="w-24 h-24 mx-auto object-contain drop-shadow-2xl" />
                <h2 className="text-3xl font-black tracking-tight">{t('scanTitle')}</h2>
                <p className="text-slate-400 text-sm">{t('scanSubtitle')}</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center text-xs">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <label htmlFor="camera-input" className="glass-panel rounded-2xl p-6 flex items-center gap-5 cursor-pointer border-energy-500/20 active:scale-95 transition-all">
                <div className="bg-energy-500 p-3 rounded-xl">
                    <Camera className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                    <span className="text-white font-black text-lg block">Câmera</span>
                    <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Scanner Inteligente</span>
                </div>
              </label>
              
              <label htmlFor="file-input" className="glass-panel rounded-2xl p-6 flex items-center gap-5 cursor-pointer active:scale-95 transition-all">
                 <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                 </div>
                 <div className="text-left">
                    <span className="text-white font-black text-lg block">Galeria</span>
                    <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest">Importar Imagem</span>
                 </div>
              </label>
            </div>

            <input id="camera-input" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        )}
      </div>
    </div>
  );
};