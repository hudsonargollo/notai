import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, ArrowLeft, Image as ImageIcon, Zap, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseReceiptImage } from '../services/geminiService';
import { AIReceiptResponse, Language, AVATAR_URL } from '../types';
import { getCategories } from '../services/expenseService';
import { useTranslation } from '../utils/i18n';
import { PageTransition } from '../src/components/layout/PageTransition';
import { FloatingActionButton } from '../src/components/layout/FloatingActionButton';
import { BottomSheet } from '../src/components/layout/BottomSheet';
import { Skeleton } from '../src/components/ui/skeleton';
import { Button } from '../src/components/ui/button';
import { scaleOnHover } from '../src/lib/animations';

interface ScannerProps {
  onScanComplete: (data: AIReceiptResponse, imageUrl: string) => void;
  onCancel: () => void;
  currentLang: Language;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete, onCancel, currentLang }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{ data: AIReceiptResponse; imageUrl: string } | null>(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
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
      setScanResult(result);
      setShowResultSheet(true);
      // Don't call onScanComplete immediately - let user review in bottom sheet first
    } catch (err) {
      console.error(err);
      setError(t('errorScan'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmScan = () => {
    if (scanResult) {
      onScanComplete(scanResult.data, scanResult.imageUrl);
      setShowResultSheet(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };

  return (
    <PageTransition>
      <div className="h-full w-full flex flex-col items-center justify-between p-6 overflow-hidden">
        <div className="w-full flex justify-start">
          <Button
            onClick={onCancel}
            variant="ghost"
            size="icon"
            className="rounded-xl glass-panel text-white"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
          {isProcessing ? (
            <div className="flex flex-col items-center w-full space-y-6">
              <motion.img
                src={AVATAR_URL}
                alt="Neo"
                className="w-32 h-32 object-contain"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-black text-white">{t('analyzing')}</h3>
                <p className="text-slate-400 text-sm px-4">{t('analyzingDesc')}</p>
              </div>
              
              {/* Loading skeleton for scan results */}
              <div className="w-full space-y-3 mt-8">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            </div>
          ) : (
            <div className="w-full space-y-8">
              <div className="text-center space-y-2">
                <motion.img
                  src={AVATAR_URL}
                  alt="Neo"
                  className="w-24 h-24 mx-auto object-contain drop-shadow-2xl"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <h2 className="text-3xl font-black tracking-tight">{t('scanTitle')}</h2>
                <p className="text-slate-400 text-sm">{t('scanSubtitle')}</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center text-xs"
                >
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" strokeWidth={2} />
                  <span className="font-bold">{error}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <motion.label
                  htmlFor="camera-input"
                  className="glass-panel rounded-2xl p-6 flex items-center gap-5 cursor-pointer border-energy-500/20"
                  whileHover="hover"
                  whileTap="tap"
                  variants={scaleOnHover}
                >
                  <div className="bg-energy-500 p-3 rounded-xl">
                    <Camera className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <span className="text-white font-black text-lg block">Câmera</span>
                    <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest">
                      Scanner Inteligente
                    </span>
                  </div>
                </motion.label>

                <motion.label
                  htmlFor="file-input"
                  className="glass-panel rounded-2xl p-6 flex items-center gap-5 cursor-pointer"
                  whileHover="hover"
                  whileTap="tap"
                  variants={scaleOnHover}
                >
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <ImageIcon className="h-6 w-6 text-slate-400" strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <span className="text-white font-black text-lg block">Galeria</span>
                    <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest">
                      Importar Imagem
                    </span>
                  </div>
                </motion.label>
              </div>

              <input
                id="camera-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
              <input
                id="file-input"
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        {/* Floating Action Button for quick actions */}
        {!isProcessing && (
          <FloatingActionButton
            icon={Zap}
            label="Quick actions"
            secondaryActions={[
              {
                icon: Camera,
                label: "Take photo",
                onClick: handleCameraClick,
              },
              {
                icon: ImageIcon,
                label: "Choose from gallery",
                onClick: handleGalleryClick,
              },
              {
                icon: FileText,
                label: "Manual entry",
                onClick: onCancel, // Return to previous screen for manual entry
              },
            ]}
          />
        )}

        {/* Bottom Sheet for scan results */}
        <BottomSheet
          open={showResultSheet}
          onOpenChange={setShowResultSheet}
          title="Scan Results"
          description="Review the scanned receipt details"
        >
          {scanResult && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Merchant</div>
                <div className="text-lg font-bold">{scanResult.data.merchant || 'Unknown'}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Amount</div>
                <div className="text-2xl font-black text-energy-500">
                  {scanResult.data.amount ? `$${scanResult.data.amount.toFixed(2)}` : 'N/A'}
                </div>
              </div>

              {scanResult.data.category && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Category</div>
                  <div className="text-lg">{scanResult.data.category}</div>
                </div>
              )}

              {scanResult.data.date && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Date</div>
                  <div className="text-lg">{scanResult.data.date}</div>
                </div>
              )}

              {scanResult.imageUrl && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Receipt Image</div>
                  <img
                    src={scanResult.imageUrl}
                    alt="Receipt"
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowResultSheet(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirmScan}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </BottomSheet>
      </div>
    </PageTransition>
  );
};
